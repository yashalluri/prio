# Prio — AI-native product management tool

## Tech Stack
- Framework: Next.js 15+ (App Router, React 19, TypeScript strict)
- Styling: Tailwind CSS v4 + shadcn/ui (new-york style) + Motion
- AI: Vercel AI SDK v6 (@ai-sdk/anthropic, @ai-sdk/react)
- Database: PostgreSQL (Neon/Vercel Postgres) + Prisma 6
- Auth: Auth.js v5 (NextAuth)
- Background Jobs: Inngest
- Integrations: @linear/sdk, @notionhq/client, @slack/web-api, @octokit/rest

## Commands
pnpm dev              # Dev server (localhost:3000)
pnpm build            # Production build
pnpm test             # Vitest
pnpm lint             # ESLint
pnpm typecheck        # TypeScript strict check
pnpm db:push          # Push Prisma schema
pnpm db:studio        # Open Prisma Studio

## Code Conventions
- Use server components by default; 'use client' only when needed
- Named exports only, never default exports
- All API tool results: { data, error, metadata } pattern
- Snake_case for API endpoints, camelCase for TypeScript
- Error boundaries required for all route segments

## Architecture
- src/app/         — Next.js App Router pages + API routes
- src/components/  — React components (ui/ for shadcn, chat/ for AI)
- src/lib/ai/      — Agent config, system prompts, tool definitions
- src/lib/integrations/ — Linear, Notion, Slack, GitHub API clients
- src/lib/          — Prisma client, auth config, utilities

## Workflows
### New Feature
1. Plan first (Shift+Tab for plan mode). Read relevant files.
2. Implement with tests. Run typecheck + lint.
3. Commit with conventional commits (feat:, fix:, chore:)

### Before modifying AI agent logic
- Read src/lib/ai/prompts.ts and src/lib/ai/tools.ts first
- Test with real tool responses, not mocks

## Gotchas
- IMPORTANT: Never modify prisma/migrations directly
- AI SDK v6 uses UIMessage, not Message — check @ai-sdk/react imports
- All integration tokens are encrypted in DB — use decrypt() helper
- Vercel function timeout is 60s; use Inngest for long agent tasks

## Reference Docs
For system prompt patterns, see docs/agent-design.md
For integration OAuth flows, see docs/oauth-flows.md
For database schema decisions, see prisma/schema.prisma