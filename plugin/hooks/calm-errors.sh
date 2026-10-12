#!/bin/bash
# Studio: plain-language notes for common failures.
# Runs as a PostToolUseFailure hook. Adds context for Claude; the original
# error stays visible underneath (a plugin can't hide it).

input=$(cat)
err=$(printf '%s' "$input" | jq -r '.error // empty' 2>/dev/null)
tool=$(printf '%s' "$input" | jq -r '.tool_name // empty' 2>/dev/null)
interrupt=$(printf '%s' "$input" | jq -r '.is_interrupt // false' 2>/dev/null)
[ "$interrupt" = "true" ] && exit 0
[ -z "$err" ] && exit 0

match() { printf '%s' "$err" | grep -Eiq "$1"; }

if match 'File has not been read yet|String to replace not found|old_string|Found [0-9]+ matches'; then
  note="This was an internal step in Claude's editing (Claude needed to re-read the file or match the text more precisely). Nothing went wrong with the user's work and there is no need to mention it unless it keeps happening."
elif match 'EADDRINUSE|address already in use|port .* (is )?(already )?in use'; then
  note="This error means another program on the computer is already using the address (port) this preview needs. The user's files are unchanged. Usual fix: use a different port, or stop the other preview."
elif match 'command not found|not recognized as an internal|No such file or directory.*(npm|node|python|gh)\b|spawn .* ENOENT'; then
  # zsh says "command not found: gh"; bash says "gh: command not found".
  tool_name=$(printf '%s' "$err" | sed -nE 's/.*command not found: ([A-Za-z0-9._-]+).*/\1/p; s/.*[: ]([A-Za-z0-9._-]+): command not found.*/\1/p' | head -1)
  note="This error means a tool the step needs${tool_name:+ ($tool_name)} is not installed on this computer. The user's files are unchanged. The next step is to install it, which needs the user's permission."
elif match 'ENOENT|No such file or directory|does not exist|cannot find'; then
  note="This error means a file or folder the step expected could not be found. The user's files are unchanged; it may have been moved or renamed, or the name may be slightly different."
elif match 'EACCES|Permission denied|Operation not permitted|EPERM'; then
  note="This error means the computer did not allow this action (a permissions setting). The user's files are unchanged. A different folder, or the user granting access, usually fixes it."
elif match 'ENOTFOUND|ECONNREFUSED|ETIMEDOUT|Could not resolve host|network is unreachable|getaddrinfo'; then
  note="This error means the step could not reach the internet or a server. The user's files are unchanged. Checking the connection or trying again later usually fixes it."
elif match 'CONFLICT|Merge conflict|merge conflict|both modified'; then
  note="This means two explorations changed the same part of a file (a clash, which developers call a merge conflict). Nothing is lost. The user needs to choose which version to keep, and Claude can show both side by side."
elif match 'not a git repository'; then
  note="This means the folder does not keep save points yet. The user's files are unchanged. The /start command can set save points up."
elif match 'npm ERR!|ERR_PNPM|yarn error|Cannot find module'; then
  note="This error came from the project's packages (ready-made code the project borrows). The user's own work is unchanged. Downloading the packages again (npm install) often fixes it."
else
  note="This step failed. The user's files are most likely unchanged."
fi

jq -n --arg c "Studio note on the failed $tool step: $note In the Studio voice, a failure is described as what happened in one plain sentence, whether the work is safe, and the next step, without the technical message unless the user asks." \
  '{hookSpecificOutput:{hookEventName:"PostToolUseFailure",additionalContext:$c}}'
