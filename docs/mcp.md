# MCP Server Draft

This document sketches the planned minimal MCP server that complements the existing `oracle` CLI.

## Tools

- `consult`
  - Inputs: `prompt` (required), `files` (string[] globs), `model` (defaults to CLI default), `engine` (`api`|`browser`, same auto-default as the CLI), `slug?` (custom session slug).
  - Behavior: creates a session (using the same storage as the CLI), runs it, streams progress, and returns the final output plus session metadata. No advanced browser toggles (profiles, headless, etc.). Background mode follows the CLI defaults (e.g., `gpt-5-pro` uses background automatically) and is not exposed as a MCP parameter.
  - Emits MCP logging notifications for both chunk streams (debug level, includes byte size) and line logs (info).

- `sessions`
  - Inputs: `{hours?, limit?, includeAll?, detail?}` with the same defaults as `oracle status`.
  - Behavior: lists stored sessions; when given a slug/ID returns a summary row by default. Set `detail: true` to fetch full stored metadata/log/request for that session (opt-in to avoid large payloads).

- Resources
  - `oracle-session://{id}/{metadata|log|request}` provides read-only access to stored session artifacts via MCP resource reads, sharing the same `~/.oracle/sessions` storage.

## Boundaries

- Session storage is shared with the CLI at `~/.oracle/sessions` (or `ORACLE_HOME_DIR` if set).
- Keep payloads minimal: omit prompt previews and advanced browser settings; stick to core fields needed to run or retrieve sessions.

## Open items

- Launch via dedicated bin `oracle-mcp`.
- Dependency surface: add `@modelcontextprotocol/sdk` and `zod` when the server is implemented.
