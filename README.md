<div align="center">

# WhatsApp AI Assistant 🤖💬

<p>
  <img src="https://img.shields.io/badge/Node.js-20+-brightgreen?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-5-black?style=for-the-badge&logo=express">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/WhatsApp-Automation-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

<p>
  Turn your WhatsApp into a fully-featured AI-powered assistant — built with <b>Express.js</b>, <b>TypeScript</b>, <b>MongoDB</b>.
</p>

<p>
  Listens to incoming WhatsApp messages and replies automatically using AI.
  Supports text, images, web search, AI image generation, conversation memory stored in MongoDB, and much more.
</p>

</div>

---

## ✨ Features

- 🤖 **Automatic AI replies** powered by Ollama (local LLM) and Google Gemini
- 📲 **WhatsApp login via QR code** — no API key required
- 🖼️ **Image understanding** — send an image and ask the AI about it
- 🌐 **Web search integration** via Tavily API for real-time information
- 🎨 **AI image generation** via Pollinations SDK
- 🎵 **Audio/media processing** with FFmpeg support
- 🧠 **Persistent conversation history** stored in MongoDB (per chat)
- 📦 **Web scraping** support using Cheerio and Axios
- 🚫 **Group chat ignored** — responds only to private messages
- ⚡ **Hot reload in dev mode** with `tsx watch`
- 🛡️ **Strict TypeScript** for safer and cleaner code

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript 5+ (ESNext, strict mode) |
| Web Framework | Express.js 5 |
| Database | MongoDB + Mongoose |
| QR Code | qrcode-terminal |
| Config | dotenv |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **MongoDB** instance (local or cloud e.g. MongoDB Atlas)
- **A WhatsApp account** for authentication
- **API Keys** (optional but recommended):
  - [Google Gemini API Key](https://aistudio.google.com/) — for cloud AI support
  - [Tavily API Key](https://tavily.com/) — for web search feature

---

### 1. Clone the repository

```bash
git clone https://github.com/ars2k03/WhatsApp-AI-Assistant.git
cd WhatsApp-AI-Assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/whatsapp-ai

# Google Gemini (optional — for cloud AI)
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily (optional — for web search)
TAVILY_API_KEY=your_tavily_api_key_here

# Ollama (default: http://localhost:11434)
OLLAMA_HOST=http://localhost:11434
```


### 4. Run the bot

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

---

## 💬 How It Works

```
User sends a WhatsApp message
        ↓
Express server receives it via Baileys
        ↓
Message is routed based on type (text / image / audio)
        ↓
AI engine selected (Ollama / Gemini cloud)
        ↓
Optional tools triggered (web search, image gen, scraping)
        ↓
Response sent back to WhatsApp
        ↓
Conversation saved to MongoDB
```

1. Express.js server starts and initializes Baileys.
2. A **QR code** appears in the terminal — scan it with WhatsApp.
3. The session is authenticated and the bot begins listening.
4. Each incoming message is processed through the AI pipeline.
5. The AI generates a reply and sends it back to WhatsApp.
6. Chat history is persisted to **MongoDB** for contextual, multi-turn conversations.

---

## 🧠 Supported Message Types

| Type | Description |
|---|---|
| Text | Standard text messages, fully supported |
| Image | Images with optional captions — analyzed by AI |
| Audio/Media | Processed via FFmpeg before handling |

> Unsupported message types receive a fallback response.

---

## ⚙️ Behavior Notes

- Conversation history is **persisted in MongoDB** per chat (not just in-memory).
- Only the most recent messages are used as context to keep prompts efficient.
- **Group chats are ignored** — the bot only responds to private (1-to-1) messages.

---

## 📝 Scripts

```json
{
  "dev":   "tsx watch ./src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## ✅ Requirements Checklist

- [ ] Node.js v20+
- [ ] A WhatsApp account (for QR scan)
- [ ] MongoDB running (local or Atlas)
- [ ] `.env` file configured
- [ ] A machine that stays online while the assistant runs

---

## 📁 Project Structure

```
WhatsApp-AI-Assistant/
├── src/
│   └── server.ts       # Main entry point
├── dist/               # Compiled output (after build)
├── .env                # Environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
└── LICENSE
```

---

## 👤 Author

**A R S**
GitHub: [@ars2k03](https://github.com/ars2k03)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

> ⚠️ **Disclaimer:** This project uses the unofficial WhatsApp Web API via Baileys. Use it responsibly and be aware of WhatsApp's Terms of Service.
