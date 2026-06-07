import { Ollama } from 'ollama';
import type { ChatMessage } from "../config/chat.js";
import { prompt } from '../system prompt/text.prompt.js';
import dotenv from 'dotenv';
dotenv.config();

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

export async function getFinalResponse(userName: string, history: ChatMessage[], toolData: string, query: string): Promise<string> {
  const finalResponse = await ollama.chat({
    model: 'gemma4:31b-cloud',
    messages: [
      { 
        role: "system", 
        content: prompt(userName) 
      },

      ...history,

      {
        role: 'user',
        content: `Use the following information to answer the user's question.

        Rules:
        1. Answer ONLY using the information provided below.
        2. Never use your own training knowledge.
        3. Prioritize facts that appear in multiple sources.
        4. If the answer is not available in the data, say: "এই মুহূর্তে সঠিক তথ্য পাওয়া যাচ্ছে না।"

        Query: ${query}

        Data:
        ${toolData}`
      }
    ]
  });

  return finalResponse.message.content;
}
