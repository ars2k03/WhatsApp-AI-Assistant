import type { WAMessage } from "@whiskeysockets/baileys";
import { Chat } from "../models/chat.model.js";
import { extractMessageData } from "./message.info.js";

export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    images?: string[];
};

export const greet = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good Night';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
}


export async function getHistory(chatId: string) {
  const chat = await Chat.findOne({chatId}).lean();

  return chat?.history || [];
}

export async function addMessage(msg : WAMessage, message: ChatMessage) {
  const {chatId, chatNumber,  userName} = extractMessageData(msg);
      
  await Chat.findOneAndUpdate(
    { chatId },
    
    { 
      $setOnInsert : {
        chatNumber
      },
      
      $push: 
        { history: 
          { 
            $each: [message], 
            $slice: -20
          }
        } 
    },

    { upsert: true }
  );
}