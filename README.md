<div align="center">

# WhatsApp AI Assistant

<p>
  <img src="https://img.shields.io/badge/Node.js-20+-brightgreen?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express.js-5-black?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Groq-LLM-f55036?style=for-the-badge" alt="Groq">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT">
</p>

<p>
  Turn WhatsApp into a personal AI assistant — text, images, voice, web search, weather, and image generation.
</p>

<p>
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-environment-variables">Env</a> ·
  <a href="#-license">License</a>
</p>

</div>

---

## Disclaimer

This project uses [Baileys](https://github.com/WhiskeySockets/Baileys), an **unofficial** WhatsApp Web multi-device library. It is **not affiliated with, endorsed by, or connected to WhatsApp / Meta**.

Use at your own risk. Automating WhatsApp may violate WhatsApp’s Terms of Service and can result in account restrictions. Prefer the [official WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp) for production business use.

---

## Features

- Automatic AI replies powered by **Groq** (text / vision / tools)
- Voice replies via **Google Gemini Live** (native audio)
- WhatsApp login via **QR code** (Baileys)
- Image understanding and AI image generation (Pollinations)
- Real-time **web search** (Tavily) and **weather** (WeatherAPI)
- Conversation memory in **MongoDB** (phone JID + LID aware)
- Auth session stored in MongoDB (cleared automatically on logout)
- Private chats only — group messages are ignored
- Express HTTP routes for health checks and AI enable/disable

---

## Tech Stack

| Layer | Stack |
| --- | --- |
| Runtime | Node.js 20+ |
| Language | TypeScript (strict, ESM) |
| WhatsApp | `baileys` |
| HTTP | Express 5 |
| Database | MongoDB + Mongoose |
| Text / vision AI | Groq (`groq-sdk`) |
| Voice AI | Google Gemini Live (`@google/genai`) |
| Tools | Tavily, WeatherAPI, Pollinations, FFmpeg |

---

## Getting Started

### Prerequisites

- Node.js **20+**
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- [FFmpeg](https://ffmpeg.org/) (for voice notes)
- API keys listed below
- A WhatsApp account for QR linking

### 1. Clone

```bash
git clone https://github.com/ars2k03/WhatsApp-AI-Assistant.git
cd WhatsApp-AI-Assistant
```

### 2. Install

```bash
npm install
```

### 3. Environment

```bash
cp .env.example .env
```

Fill in `.env` (see [Environment Variables](#-environment-variables)).

### 4. Run

Development (hot reload):

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Scan the QR code in the terminal with WhatsApp → Linked Devices.

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_DB` | Yes | MongoDB connection URI |
| `GROQ_API_KEY` | Yes | Groq API key (text / tools / vision) |
| `GOOGLE_API_KEY` | Yes* | Google AI Studio key (voice / Gemini Live) |
| `ARS_API_KEY` | Yes | Secret for protected HTTP routes (`x-api-key`) |
| `SEARCH_API_KEY` | No | Tavily API key (web search tool) |
| `WEATHER_API_KEY` | No | WeatherAPI key |
| `POLLINATIONS_API_KEY` | No | Pollinations image generation |
| `PORT` | No | HTTP port (default `8000`) |

\*Required only if you use voice notes.

Example:

```env
MONGO_DB=mongodb+srv://USER:PASSWORD@cluster0.example.mongodb.net/
ARS_API_KEY=change-me
GROQ_API_KEY=gsk_...
GOOGLE_API_KEY=AIza...
SEARCH_API_KEY=tvly-...
WEATHER_API_KEY=
POLLINATIONS_API_KEY=
```

---

## How It Works

```
Incoming WhatsApp message (Baileys)
        ↓
Route by type: text / image / audio
        ↓
Groq (text, vision, tools) or Gemini Live (audio)
        ↓
Optional tools: web search, weather, image gen
        ↓
Reply sent on WhatsApp
        ↓
History saved in MongoDB
```

1. Express starts and Baileys connects.
2. QR appears → scan with WhatsApp.
3. Session credentials are stored in MongoDB (`whatsapp_auth`).
4. Private messages are handled; groups are skipped.
5. On logout, auth state is wiped so a fresh QR can be scanned.

---

## HTTP API

Base URL defaults to `http://localhost:8000`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Health check |
| `GET` | `/status` | `x-api-key` | AI enabled flag |
| `POST` | `/status` | `x-api-key` | Set `{ "enabled": true/false }` |

Full reference + Postman collection: **[docs/API.md](docs/API.md)**

Toggle AI:

```bash
curl -X POST http://localhost:8000/status \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ARS_API_KEY" \
  -d '{"enabled":true}'
```

---

## Scripts

| Script | Command |
| --- | --- |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm start` |

---

## Project Structure

```
WhatsApp-AI-Assistant/
├── .github/
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── API.md
│   └── WhatsApp-AI-Assistant.postman_collection.json
├── src/
│   ├── ai brain/
│   ├── config/
│   ├── converter/
│   ├── database/
│   ├── handler/
│   ├── helper/
│   ├── middleware/
│   ├── models/
│   ├── router/
│   ├── system prompt/
│   ├── tools/
│   ├── whatsapp/
│   └── server.ts
├── .env.example
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .nvmrc
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── README.md
├── SECURITY.md
└── tsconfig.json
```

---

## Requirements Checklist

- [ ] Node.js 20+
- [ ] MongoDB URI configured
- [ ] `.env` filled from `.env.example`
- [ ] FFmpeg installed (voice)
- [ ] Groq (+ optional Gemini / Tavily / Weather) keys
- [ ] Machine stays online while the bot runs

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports and PRs are welcome.

---

## Security

Please do **not** open public issues for vulnerabilities that expose secrets or enable account takeover. See [SECURITY.md](SECURITY.md).

Never commit `.env`, API keys, or WhatsApp session data.

---

## Author

**A R S** ([@ars2k03](https://github.com/ars2k03))

- GitHub: https://github.com/ars2k03
- LinkedIn: https://linkedin.com/in/ars2k03

---

## License

This project is licensed under the [MIT License](LICENSE).
