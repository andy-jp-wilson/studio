#!/bin/bash
# Studio: hidden snapshot before Claude's first change in each request.
# Runs as a PreToolUse hook and uses bin/studio-snapshot, which leaves the
# current branch, the index and the working tree untouched.
# Never blocks the tool: every path exits 0.

input=$(cat)
field() { printf '%s' "$input" | jq -r "$1 // empty" 2>/dev/null; }

cwd=$(field .cwd)
session=$(field .session_id)
prompt=$(field .prompt_id)
[ -n "$cwd" ] && cd "$cwd" 2>/dev/null || exit 0

state="${CLAUDE_PLUGIN_DATA:-${TMPDIR:-/tmp}/studio}/turns"
mkdir -p "$state" 2>/dev/null
key="${session:-nosession}-${prompt:-noprompt}"
[ -e "$state/$key" ] && exit 0
touch "$state/$key" 2>/dev/null
find "$state" -type f -mtime +1 -delete 2>/dev/null   # tidy old flags

say() {
  jq -n --arg c "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$c}}'
  exit 0
}

result=$("${CLAUDE_PLUGIN_ROOT:-$(dirname "$0")/..}/bin/studio-snapshot")
case "$result" in
  "created "*)
    say "Studio made a hidden snapshot (${result#created }) of the user's files before this change. The user can return to it by saying 'go back'." ;;
  "same-as-save-point "*)
    say "Studio checked before this change: the user's files match their last save point (\"${result#same-as-save-point }\"), so that save point already covers going back and no extra snapshot was needed." ;;
  "same-as-snapshot "*)
    say "Studio checked before this change: the user's files match the existing snapshot ${result#same-as-snapshot }, which already covers going back." ;;
  "no-save-points")
    note="$state/${session:-nosession}-nogit"
    [ -e "$note" ] && exit 0
    touch "$note"
    say "Studio note: this folder does not keep save points yet, so Studio could not make a snapshot before this change. The /start command can set save points up." ;;
esac
exit 0
