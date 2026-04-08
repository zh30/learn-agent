# Repository Guidelines

## Project Structure & Module Organization

- `index.ts` — Entry point for the Bun server.
- `first-agent.ts` — Agent implementation using `@anthropic-ai/claude-agent-sdk`.
- `package.json` — Dependencies and scripts; uses Bun as the runtime.
- `tsconfig.json` — Strict TypeScript config targeting ESNext with bundler module resolution.

## Build, Test, and Development Commands

| Command | Description |
|---|---|
| `bun install` | Install dependencies |
| `bun --hot ./index.ts` | Run the server with hot-reload |
| `bun test` | Run tests (uses Bun's built-in test runner) |
| `bun run <script>` | Run a script defined in package.json |

## Coding Style & Naming Conventions

- Runtime: **Bun** — always use `bun` over `node`, `npm`, `npx`, etc.
- TypeScript strict mode is enabled; follow all `strict` checks.
- Use `ESNext` target and `ESNext` lib; prefer modern JS features.
- Imports use `.ts` extensions when needed (Bun resolves them natively).
- No emit — `noEmit: true` in tsconfig; Bun handles execution directly.

### Bun API Preferences
- `Bun.serve()` for HTTP/WebSocket servers (not Express)
- `bun:sqlite` for SQLite (not `better-sqlite3`)
- `Bun.file()` for file I/O (not `node:fs` readFile/writeFile)
- `WebSocket` built-in (not `ws`)
- `Bun.$` for shell commands (not `execa`)
- Bun auto-loads `.env` — no `dotenv` needed

## Testing Guidelines

- Use `bun:test` — `import { test, expect } from "bun:test"`.
- Test files follow the `*.test.ts` naming pattern.
- Run all tests with `bun test`.

## Commit & Pull Request Guidelines

- Write clear, imperative commit messages (e.g., "add agent SDK integration").
- Keep PRs focused on a single concern.
- Ensure `bun test` passes before pushing.
