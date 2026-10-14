#!/bin/bash
# Studio: pre-approve Studio's own helper commands (studio-changelog,
# studio-capture, studio-pack, studio-snapshot, studio-version) so multi-step commands like
# /handover don't stop for permission after the person answers a question.
# Only a single plain call qualifies: no ; & | ` $ < > ( ) or newlines, so
# nothing else can be chained on. Everything else follows normal permissions.

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$cmd" ] && exit 0
case "$cmd" in *$'\n'*) exit 0 ;; esac

if printf '%s' "$cmd" | grep -Eq '^studio-(changelog|capture|pack|snapshot|version)( [^;&|`$<>()\\]*)?$'; then
  jq -n '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"allow",permissionDecisionReason:"Studio helper"}}'
fi
exit 0
