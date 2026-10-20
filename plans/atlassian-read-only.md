# Atlassian read-only: what's possible

Checked 2026-10-20, official Atlassian and Claude Code sources. Supports R16 and R19 to R22 in `plans/requirements-and-journey.md`.

## Atlassian's side (R21)

- **An org admin can make the connector read-only.** Atlassian Administration > Connectors > Atlassian MCP server > Permissions: **Read**, **Write** and **Search**, each Allowed, Blocked or Partially allowed, set per app (Jira and Confluence separately). Blocking **Write** gives read-only, and these settings "take precedence over settings in Connected Apps or individual app permissions in Marketplace". Avoid "Allow all, apply permissions to future additions automatically". https://support.atlassian.com/security-and-access-policies/docs/Configure-Atlassian-Rovo-MCP-server-permission/
- **It uses the person's own permissions:** "Access is scoped to the user's existing permissions in Atlassian." Someone with view-only access can't change anything through it. https://support.atlassian.com/security-and-access-policies/docs/understand-atlassian-mcp-server/
- **API tokens with chosen scopes** are possible (e.g. `read:jira:agent-interface`, `search:jira:agent-interface`, `read:confluence:agent-interface`), but the docs don't say outright that a read-only token blocks the write tools. https://developer.atlassian.com/cloud/rovo-mcp/guides/configuring-authentication-via-api-token/
- **Not confirmed:** choosing read-only when an individual signs in. Single tools can't be switched on or off.
- Delete and manage tools for Jira are off by default. https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/

## Claude Code's side (R19)

- Rules name tools as `mcp__<server>__<tool>`; `mcp__<server>__*` covers a whole server. Deny always wins over allow, at any level. https://code.claude.com/docs/en/permissions
- **Managed settings** (installed by the organisation) can't be overridden, and `allowManagedPermissionRulesOnly` makes them the only rules read.
- **Watch out:** Atlassian's `executeWrite` and `executeDestructive` tools reach hidden write tools, so they must be blocked too, and tool names change (older names like `addCommentToJiraIssue` are gone). That's why Studio's own check (R20) should allow only known reading tools rather than list dangerous ones.

## Tool groups (current names)

- **Read / search, allowed:** `getJiraIssue`, `listJiraIssueComments`, `listJiraProjects`, `searchJiraIssuesUsingJql`, `getConfluenceContent`, `listConfluenceContent`, `listConfluenceSpaces`, `exportConfluenceContent`, `searchConfluence`, `atlassianUserInfo`, `getAccessibleAtlassianResources`, `discover`, `executeRead`.
- **Everything else is refused,** including `executeWrite`, `executeDestructive`, every create, edit, transition, comment, attachment, link, sprint, move, archive, permission, public-link, delete and manage tool.

## So, the strongest setup

1. **Atlassian admin blocks Write** (and delete/manage stay off) for the connector. Jira and Confluence then refuse any change, whatever happens on the computer.
2. **Claude Code blocks** `executeWrite`, `executeDestructive` and every write tool by name, ideally in company-managed settings.
3. **Studio allows only the reading tools above.**
4. **A test** tries a change and shows it refused.
