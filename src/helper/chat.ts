import type { WAMessage } from "@whiskeysockets/baileys";
import { Chat } from "../models/chat.model.js";
import { extractMessageData } from "./message.info.js";
import type { ChatMessage } from "../config/chat.js";

export const greet = () => {
    const hour = Number(
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: "Asia/Dhaka",
  }).format(new Date())
);

    if(hour >= 21 || hour < 5 ) return 'Good Night';
    else if(hour>= 5 && hour < 12 ) return 'Good Morning';
    else if(hour >= 12 && hour <= 17) return 'Good Afternoon';
    return 'Good Evening';
};

export async function getHistory(chatId: string) {
  const chat = await Chat.findOne({chatId}).lean();

  return chat?.history || [];
}

export async function addMessage(msg : WAMessage, message: ChatMessage) {
  const {chatId, chatNumber} = extractMessageData(msg);
      
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
