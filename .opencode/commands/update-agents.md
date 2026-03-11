---
description: Regenerate AGENTS.md to reflect the current state of the codebase
agent: build
---

Analyze the current state of this codebase and rewrite `AGENTS.md` in the project root.

The file is aimed at agentic coding assistants (like yourself) operating in this repo. Keep it around 150 lines. It must stay accurate and current — do not include anything speculative or aspirational.

Use the following shell commands to gather up-to-date facts before writing:

Project structure:
!`find app components lib prisma -type f | sort`

Package versions and scripts:
!`cat package.json`

TypeScript config:
!`cat tsconfig.json`

ESLint config:
!`cat eslint.config.mjs`

Prisma schema:
!`cat prisma/schema.prisma`

Cover all of the following sections, updating them to reflect what is *actually* in the repo right now:

1. **Commands** — dev, build, lint, type-check, test (note if no test framework exists), any post-schema-change instructions
2. **Project Structure** — accurate directory tree with one-line annotations
3. **Tech Stack** — table of framework, language, styling, components, ORM, auth, payments, email, validation, toasts, icons
4. **Code Style** — formatting (quotes, semicolons, no Prettier), TypeScript (strict, import type, interface vs type, path alias), import order, naming conventions table, React component rules (server-first, function declarations, default vs named exports), API route pattern (3-layer auth/validate/logic, `{ data, error }` shape), server action pattern, toast conventions, Prisma usage, Supabase auth usage
5. **Order Flow** — brief description of the 3-step flow and what OrderContext holds
6. **Key Rules** — important gotchas specific to this repo (middleware file name, Tailwind config location, Prisma client output path, stale LSP errors, etc.)

Do not add sections beyond what is listed above. Do not pad with filler. Write only what a future agent needs to work correctly in this repo.
