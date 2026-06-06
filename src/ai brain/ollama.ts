import { Ollama } from 'ollama';
import { getHistory, greet, type ChatMessage } from '../helper/chat.js';
import { prompt } from '../system prompt/text.prompt.js';
import dotenv from 'dotenv';
dotenv.config();

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

export async function generatedReply(chatId : string, userName : string) {

    const history : ChatMessage[] = await getHistory(chatId);

    if (history.length === 1) {
        return `${greet()} ${userName}, 👋\n\nআমি *A R S AI* 🤖\nবলুন, আমি আপনাকে কীভাবে সাহায্য করতে পারি?😊`
    }

    try {
        
        const response  = await ollama.chat({
            model: 'gemma4:31b-cloud',
            think : true,
            messages: [
                {
                    role: "system",
                    content: prompt(userName)
                },
                ...history,
            ],
        })

        return response.message.content;

    } catch (e) {
        console.error("API error:", e);
        return "দুঃখিত, এই মুহূর্তে আমি উত্তর করতে পারছি না। একটু পরে আবার চেষ্টা করুন।";
    }
}