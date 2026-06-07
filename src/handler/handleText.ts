import type { WAMessage } from "@whiskeysockets/baileys";
import { generatedReply } from "../ai brain/ollama.js";
import { addMessage } from "../helper/chat.js";
import { extractMessageData } from "../helper/message.info.js";

export const handleTextMessage = async ( sock: any, msg: WAMessage) => {
  const {chatId, userName, text} = extractMessageData(msg);

  await addMessage(msg, {
    role : "user",
    content : text
  })
  
  await sock.sendPresenceUpdate("composing", chatId);

  const {type, content, imageBuffer} = await generatedReply(chatId,userName);
  
  if(type === 'image'){

    const buffer = imageBuffer;
    
    await sock.sendMessage(chatId, {
      image: buffer,
      caption: `🎨 ${content}`,
    });

  }else{
    await sock.sendMessage(chatId, {
      text: content,
    });
  }

  await sock.sendPresenceUpdate("paused", chatId);
}