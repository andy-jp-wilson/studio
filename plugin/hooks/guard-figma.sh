#!/bin/bash
# Studio guardrail: Figma changes stay inside the project.
# Before any Figma action that can change a file (use_figma and friends, from
# either Figma connection), this hook:
#   - refuses it if the file is a design system file (from the team's design
#     systems list, STUDIO_DESIGN_SYSTEMS, or the project's .studio/project.json),
#     even if Claude was asked;
#   - asks the person before Claude first works in each Figma file in a
#     conversation, in plain words: which file (by name when Studio knows it),
#     what Claude says the step is for, and that it may read or change it.
#     Claude can't answer that prompt for them.
# Once a change to a file has gone through (record mode, run after the action),
# later changes to it in the same conversation pass to the normal permissions.
#
#   guard-figma.sh          PreToolUse: allow, ask or refuse
#   guard-figma.sh record   PostToolUse: remember the file for this conversation

input=$(cat)
key=$(printf '%s' "$input" | jq -r '.tool_input.fileKey // empty' 2>/dev/null)
[ -z "$key" ] && exit 0
session=$(printf '%s' "$input" | jq -r '.session_id // "none"' 2>/dev/null | tr -cd 'A-Za-z0-9_-')
seen="$HOME/.studio/figma-allowed/${session:-none}"

if [ "$1" = record ]; then
  mkdir -p "$(dirname "$seen")" && { grep -qxF "$key" "$seen" 2>/dev/null || echo "$key" >> "$seen"; }
  exit 0
fi

# The file key from a Figma link: figma.com/design/<key>/… or …/branch/<branch key>/…
keys_in() { grep -Eo 'figma\.com/(design|file|board|slides|proto)/[A-Za-z0-9]+(/branch/[A-Za-z0-9]+)?' | sed -E 's#.*/(design|file|board|slides|proto)/##; s#/branch/# #' | tr ' ' '\n'; }

# The project's notes (.studio/project.json), from the folder Claude is in or above it.
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
dir=${cwd:-$PWD}; project=""
while [ -n "$dir" ] && [ "$dir" != / ]; do
  [ -f "$dir/.studio/project.json" ] && { project="$dir/.studio/project.json"; break; }
  dir=$(dirname "$dir")
done

ds_keys=$( { printf '%s\n' "$STUDIO_DESIGN_SYSTEMS" | tr ';' '\n'; [ -n "$project" ] && jq -r '.designSystemUrl // .designSystemLink // empty' "$project" 2>/dev/null; } | keys_in)
target_keys=""; target_name=""
if [ -n "$project" ]; then
  target_keys=$(jq -r '.targetFileUrl // empty' "$project" 2>/dev/null | keys_in)
  target_name=$(jq -r '.targetFileName // empty' "$project" 2>/dev/null)
fi

decide() { jq -n --arg d "$1" --arg r "$2" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$d,permissionDecisionReason:$r}}'; exit 0; }

if printf '%s\n' "$ds_keys" | grep -qxF "$key"; then
  name=$(printf '%s\n' "$STUDIO_DESIGN_SYSTEMS" | tr ';' '\n' | grep -F "$key" | sed -E 's/ *\|.*//; s/^ +//' | head -1)
  decide deny "Studio never changes a design system file${name:+ ($name)}, so this was stopped and nothing in it changed. Tell the person in plain words. If the design system needs something, offer to write a note for the design system team. Reading it is fine with get_metadata, get_design_context or search_design_system; work on the project's own Figma file instead."
fi

grep -qxF "$key" "$seen" 2>/dev/null && exit 0

# What Claude says this step is for (Figma's tool asks for a short description).
what=$(printf '%s' "$input" | jq -r '.tool_input.description // empty' 2>/dev/null | tr '\n' ' ' | cut -c1-160 | sed -E 's/ +$//')
doing=${what:+ Claude says it will: \"$what\".}
after=" If you allow it, Claude won't ask again about this file in this conversation."

if printf '%s\n' "$target_keys" | grep -qxF "$key"; then
  decide ask "Claude wants to work in Figma, in this project's file${target_name:+, \"$target_name\"}.$doing It may read the file or change it.$after"
fi
decide ask "Claude wants to work in a Figma file that isn't this project's own one (Figma's ID for it: $key).$doing It may read the file or change it. Allow it only if you asked Claude to work in that file.$after"
