import { greet, type ChatMessage } from '../helper/cofig.js';
import { prompt } from '../prompt/system.prompt.js';
import ollama from 'ollama';

export async function generatedReply(history : ChatMessage[], userName : string) {

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