import { Ollama } from 'ollama';
import { getHistory, greet} from '../helper/chat.js';
import { prompt } from '../system prompt/text.prompt.js';
import dotenv from 'dotenv';
dotenv.config();
import { tools } from '../tools/gemmatools.js';
import { generatedIamge } from './pollinations.js';
import type { ChatMessage } from '../config/chat.js';
import type { Reply } from '../config/reply.js';
import { handleGetWeather } from '../handler/get_weather.js';
import { handleWebSearch } from '../handler/get_web_search.js';
import { getFinalResponse } from '../tools/toolsResponse.js';

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

export async function generatedReply(chatId : string, userName : string) : Promise<Reply> {

    const history : ChatMessage[] = await getHistory(chatId);

    if (history.length === 1) {
        return {
            type : 'text',
            content : `${greet()} ${userName}! 👋\n\nআমি *Zara*, স্যারের AI Assistant 🤖 বলুন, আমি কীভাবে আপনাকে সাহায্য করতে পারি? 😊`
        }
    }

    try {
        
        const response  = await ollama.chat({
            model: 'gemma4:31b-cloud',
            think : true,
            tools,
            messages: [
                {
                    role: "system",
                    content: prompt(userName)
                },
                ...history,
            ],
        })

        
        if (response.message.tool_calls?.length) {
            const tool = response.message.tool_calls[0];

            if (!tool) {
                return {
                    type: 'text',
                    content: 'Something went wrong. Please try again later'
                };
            }

            if (tool.function.name === "generate_image") {
                
                const imagePrompt = tool.function.arguments.prompt;
                
                const imageBuffer = await generatedIamge(imagePrompt);

                if (!imageBuffer) {
                    return {
                        type: "text",
                        content: "Image generation failed. Please try again later"
                    };
                }

                return {
                    type : 'image',
                    imageBuffer : imageBuffer,
                    content : imagePrompt
                };
                
            };

            if (tool.function.name === "web_search") {
                const args = tool.function.arguments as Record<string, string>;
                if (!args.query) return { type: 'text', content: 'Something went wrong.' };

                const searchResult = await handleWebSearch(args.query);

                const content = await getFinalResponse(
                    userName,
                    history,
                    searchResult,
                    args.query
                );

                return {
                    type: "text",
                    content: content
                };
            }

            if (tool.function.name === "get_weather") {
                const args = tool.function.arguments as Record<string, string>;
                if (!args.location) return { type: 'text', content: 'Something went wrong.' };

                const weatherResult = await handleGetWeather(args.location);
                
                const content = await getFinalResponse(userName, history, weatherResult, args.location);
                return { type: 'text', content };
            }

        }

        return {
            type : 'text',
            content : response.message.content
        }
        

    } catch (e) {
        console.error("API error:", e);
        return {
            type : 'text',
            content : "দুঃখিত, এই মুহূর্তে আমি উত্তর করতে পারছি না। কিছুক্ষণ পর আবার চেষ্টা করুন"
        } 
    }
}