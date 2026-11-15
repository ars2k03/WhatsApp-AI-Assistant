# Contributing

Thanks for your interest in improving WhatsApp AI Assistant.

## Ground rules

- Be respectful.
- Do not commit secrets (`.env`, API keys, WhatsApp sessions).
- Keep PRs focused — one concern per pull request.
- Match existing TypeScript / ESM style.

## Development setup

1. Fork and clone the repo.
2. Use Node.js 20+ (`nvm use` if you have nvm).
3. `npm install`
4. `cp .env.example .env` and fill required keys.
5. `npm run dev`

## Branching

- `main` — stable
- Feature branches: `feat/short-description`
- Fixes: `fix/short-description`

## Pull requests

1. Open an issue first for larger changes when possible.
2. Ensure `npm run build` succeeds.
3. Fill out the PR template.
4. Describe **why** the change is needed, not only what changed.

## Code notes

- Entry point: `src/server.ts`
- WhatsApp socket: `src/whatsapp/whatsapp.ts`
- Text / tools AI: `src/ai brain/groq.ts`
- Voice AI: `src/ai brain/gemini.ts`
- Chat identity must stay phone-JID-first (see `src/helper/message.info.ts`)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
