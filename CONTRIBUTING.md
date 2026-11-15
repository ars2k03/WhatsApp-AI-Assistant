# Contributing

Thanks for improving WhatsApp AI Assistant.

## Ground rules

- Be respectful.
- Do not commit secrets (`.env`, API keys, WhatsApp sessions).
- Keep PRs focused — one concern per pull request.
- Match existing TypeScript / Flutter style in each app.

## Monorepo setup

1. Fork and clone.
2. Node.js 20+ and pnpm (`corepack enable`).
3. `pnpm install`
4. `cp apps/server/.env.example apps/server/.env`
5. Server: `pnpm dev`
6. Mobile (optional): Flutter SDK — `cd apps/mobile && flutter pub get`

## Apps

| App | Path | Tooling |
| --- | --- | --- |
| Server | `apps/server` (`@whatsapp-ai/server`) | pnpm + Turborepo |
| Mobile | `apps/mobile` | Flutter only (`flutter build apk --release`) |

## Branching

- `main` — stable
- `feat/short-description`
- `fix/short-description`

## Pull requests

1. Open an issue first for larger changes when possible.
2. Ensure `pnpm build` succeeds for server changes.
3. Fill out the PR template.
4. Describe **why**, not only what.

## Server code map

- Entry: `apps/server/src/server.ts`
- WhatsApp: `apps/server/src/whatsapp/whatsapp.ts`
- Text AI: `apps/server/src/ai brain/groq.ts`
- Voice AI: `apps/server/src/ai brain/gemini.ts`
- Chat identity: `apps/server/src/helper/message.info.ts`

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
