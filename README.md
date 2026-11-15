<div align="center">

# WhatsApp AI Assistant

<p>
  <img src="https://img.shields.io/badge/Node.js-20+-brightgreen?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/pnpm-workspace-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm">
  <img src="https://img.shields.io/badge/Turborepo-2.11-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo">
  <img src="https://img.shields.io/badge/Flutter-mobile-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT">
</p>

<p>
  Monorepo: WhatsApp AI <b>server</b> (Baileys + Groq + Gemini Live) and a Flutter <b>mobile</b> controller.
</p>

</div>

---

## Disclaimer

This project uses [Baileys](https://github.com/WhiskeySockets/Baileys), an **unofficial** WhatsApp Web multi-device library. It is **not affiliated with WhatsApp / Meta**. Use at your own risk.

---

## Monorepo layout

```
WhatsApp-AI-Assistant/
├── apps/
│   ├── server/
│   └── mobile/
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

| App | Path | Stack |
| --- | --- | --- |
| Server | `apps/server` | Express, Baileys, Groq, Gemini Live, MongoDB |
| Mobile | `apps/mobile` | Flutter |

---

## Prerequisites

- **Node.js 20+**
- **pnpm 9+** (repo pinned to `pnpm@12.21.0` via `packageManager`)
- **MongoDB** (local or Atlas)
- **FFmpeg** (voice notes on server)
- **Flutter SDK** (only for mobile)
- API keys — see `apps/server/.env.example`

---

## Setup

```bash
git clone https://github.com/ars2k03/WhatsApp-AI-Assistant.git
cd WhatsApp-AI-Assistant

corepack enable
pnpm install

cp apps/server/.env.example apps/server/.env
# edit apps/server/.env
```

---

## Scripts (root — server / Turbo only)

| Command | Description |
| --- | --- |
| `pnpm dev` | Run server with hot reload |
| `pnpm build` | TypeScript build for server |
| `pnpm start` | Run compiled server |
| `pnpm build:apk` | Flutter release APK → `output/<app-name>.apk` |

---

## Server

```bash
pnpm dev
```

1. Scan the QR code in the terminal with WhatsApp → Linked Devices.
2. HTTP API on `http://localhost:8000` (default).
3. Full API docs: **[docs/API.md](docs/API.md)**  
   Postman: **[docs/WhatsApp-AI-Assistant.postman_collection.json](docs/WhatsApp-AI-Assistant.postman_collection.json)**

### Environment (`apps/server/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_DB` | Yes | MongoDB URI |
| `GROQ_API_KEY` | Yes | Groq (text / tools / vision) |
| `GOOGLE_API_KEY` | Yes* | Gemini Live (voice) |
| `ARS_API_KEY` | Yes | `x-api-key` for `/status` |
| `SEARCH_API_KEY` | No | Tavily |
| `WEATHER_API_KEY` | No | WeatherAPI |
| `POLLINATIONS_API_KEY` | No | Image generation |
| `PORT` | No | Default `8000` |

\*Required for voice notes.

---

## Mobile (Flutter)

Turbo only manages the Node server. Release APK from the repo root:

```bash
cd apps/mobile && flutter pub get && cd ../..
pnpm build:apk
```

Output (name from `apps/mobile/pubspec.yaml`):

```text
output/w.a.c.apk
```

Debug / device run:

```bash
cd apps/mobile
flutter run
```

See `apps/mobile/README.md` for more Flutter notes.

---

## HTTP API (server)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Health check |
| `GET` | `/status` | `x-api-key` | AI enabled flag |
| `POST` | `/status` | `x-api-key` | `{ "enabled": true/false }` |

```bash
curl -s -X POST http://localhost:8000/status \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ARS_API_KEY" \
  -d '{"enabled":true}'
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md). Never commit `.env` or WhatsApp sessions.

## Author

**A R S** ([@ars2k03](https://github.com/ars2k03))

## License

[MIT](LICENSE)
