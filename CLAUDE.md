## Learning and Memory Management

- Memory is handled by the **Hindsight** MCP server (Hindsight Cloud, bank `openclaw`). The `hindsight-memory` plugin auto-recalls on every prompt and auto-retains on stop, so durable context is captured automatically.
- Proactively `retain` / `sync_retain` important technical decisions, architectural choices, user preferences, and project context; `recall` (or `reflect`) relevant prior context before starting complex tasks.
- The `private-journal` tool has been removed — do not use it. Use Hindsight for all memory.
- Hindsight runs on top of Claude's native auto-memory, which remains enabled.
