#!/bin/bash
# Studio guardrail: work stays on this computer by default.
# Before Claude uploads (git push, gh pr create) or creates an upload place
# (gh repo create/fork, git remote add/set-url), this hook:
#   - with a team list (STUDIO_ALLOWED_ORGS="org1,org2" in Claude Code's
#     settings env), refuses anything going outside those GitHub owners;
#   - otherwise asks the person, naming where the work would go and whether
#     it's a personal GitHub account. Claude can't answer that prompt for them.
# Everything else passes through to the normal permissions.

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$cmd" ] && exit 0
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
[ -n "$cwd" ] && cd "$cwd" 2>/dev/null

has() { printf '%s' "$cmd" | grep -Eq "$1"; }
action=""
if has '(^|[;&|(` ]|\$\()gh +repo +(create|fork)\b'; then action=create
elif has '(^|[;&|(` ]|\$\()git( +-C +[^ ]+)? +remote +(add|set-url)\b'; then action=create
elif has '(^|[;&|(` ]|\$\()git( +-C +[^ ]+)? +push\b'; then action=push
elif has '(^|[;&|(` ]|\$\()gh +pr +create\b'; then action=push
fi
[ -z "$action" ] && exit 0

# Where it would go: owner/repo from a URL or name in the command, else the
# remote being pushed to (origin by default).
url=$(printf '%s' "$cmd" | grep -Eo '(https://github\.com/|git@github\.com:)[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+' | head -1)
if [ -z "$url" ] && [ "$action" = create ]; then
  name=$(printf '%s' "$cmd" | sed -nE 's/.*gh +repo +(create|fork) +([A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?).*/\2/p' | head -1)
  case "$name" in */*) url="https://github.com/$name" ;; esac
fi
if [ -z "$url" ] && [ "$action" = push ]; then
  remote=$(printf '%s' "$cmd" | sed -nE 's/.*git( +-C +[^ ]+)? +push((( +-[^ ]+)*) +([^- ][^ ]*))?.*/\5/p' | head -1)
  url=$(git remote get-url "${remote:-origin}" 2>/dev/null || git remote get-url origin 2>/dev/null)
fi
target=$(printf '%s' "$url" | sed -nE 's#.*github\.com[:/]([^/]+)/([^/ ]+).*#\1/\2#p' | sed 's/\.git$//')
owner=${target%%/*}
me=$(gh config get user -h github.com 2>/dev/null)
# gh repo create with no owner makes it under the signed-in account.
if [ -z "$owner" ] && [ "$action" = create ] && has 'gh +repo +(create|fork)'; then owner="$me"; target="$me/(new project)"; fi

personal=""
[ -n "$owner" ] && [ -n "$me" ] && [ "$owner" = "$me" ] && personal=", a personal GitHub account"
where=${target:-${url:-somewhere outside this computer}}

decide() { jq -n --arg d "$1" --arg r "$2" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$d,permissionDecisionReason:$r}}'; exit 0; }

if [ -n "$STUDIO_ALLOWED_ORGS" ]; then
  # Each entry is an organisation or account ("acme") or one repository
  # ("acme/design-work", or its GitHub link).
  allowed=$(printf '%s' "$STUDIO_ALLOWED_ORGS" | tr 'A-Z' 'a-z' | tr -d ' ' | tr ',' '\n' \
    | sed -E 's#^(https?://)?(www\.)?github\.com[:/]##; s#^git@github\.com:##; s#\.git$##; s#/+$##')
  o=$(printf '%s' "$owner" | tr 'A-Z' 'a-z'); full=$(printf '%s' "$target" | tr 'A-Z' 'a-z')
  ok=""
  while IFS= read -r a; do
    [ -z "$a" ] && continue
    case "$a" in */*) [ -n "$full" ] && [ "$a" = "$full" ] && ok=1 ;; *) [ -n "$o" ] && [ "$a" = "$o" ] && ok=1 ;; esac
  done <<< "$allowed"
  if [ -z "$ok" ]; then
    if [ -n "$target" ]; then why="$target isn't on it"; else why="this project has no upload place there"; fi
    decide deny "Studio only uploads to your team's GitHub repository ($STUDIO_ALLOWED_ORGS), and $why, so this was stopped. The work is still saved on this computer. Tell the person in plain words and suggest asking their team where to share it."
  fi
fi

if [ "$action" = create ]; then
  decide ask "Studio keeps work on this computer by default. This would set up a new upload place: $where$personal. Only allow it if you asked for that."
fi
decide ask "This uploads your work to $where$personal. Studio keeps work on this computer unless you say otherwise."
