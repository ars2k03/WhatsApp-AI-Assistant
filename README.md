<div align="center">

# WhatsApp AI Assistant 🤖💬
<p>
  <img src="https://img.shields.io/badge/Node.js-20+-brightgreen?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express">
  <img src="https://img.shields.io/badge/LLM-Integrated-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/WhatsApp-Automation-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

<p>
  Turn your WhatsApp into an AI-powered assistant built with <b>Express.js</b>, <b>TypeScript</b>, <b>Baileys</b>, and <b>Ollama</b>.
</p>

<p>
  This project listens to incoming WhatsApp messages and generates smart replies automatically.
  It supports text & image messages, conversation memory, and AI reply toggling with simple commands.
</p>


</div>

## ✨ Features

- **Automatic AI replies** to incoming WhatsApp messages
- **WhatsApp  login via QR code**
- **Text and image message support**
- **Conversation history** per chat for more contextual replies
- **AI toggle command** using `.ai`
- **Built with TypeScript** for cleaner and safer code
- **Express.js server** to run and manage the bot process

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **@whiskeysockets/baileys**
- **Ollama**
- **dotenv**
- **qrcode-terminal**


## 🚀 Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/ars2k03/WhatsApp-AI-Assistant.git
cd WhatsApp-AI-Assistant
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure Ollama

Make sure Ollama is installed on your local machine and your local machine is connected to your Ollama account.

If it isn't, configure an Ollama API endpoint before running the bot.


### 4) Run the bot

Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production build:

```bash
npm start
```

## 💬 How It Works

1. The server starts with Express.
2. The WhatsApp session connects using Baileys.
3. A QR code is shown in the terminal for authentication.
4. Incoming messages are read and sent to the AI layer.
5. The assistant replies back in WhatsApp with a generated response.

## 🧠 Supported Message Types

- **Text messages**
- **Image messages** with optional captions

If a message is not supported, the bot sends a fallback response.

## ⚙️ Behavior Notes

- The bot stores recent chat history in memory.
- Only the latest 20 messages are kept per chat.
- Group chats are ignored in the current implementation.
- Messages from the bot itself can be used to toggle the AI state with `.ai`.

## 📝 Scripts

```json
{
  "dev": "tsx watch ./src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## ✅ Requirements

- Node.js
- A WhatsApp account
- A working Ollama setup
- A machine (Your Pc) that can stay online while the assistant is running

## 📌 Example Usage

Send a message to the connected WhatsApp number, and the assistant will reply automatically.

To disable or enable the AI reply mode, send:

```text
.ai
```

## 👤 Author

**A R S**

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

