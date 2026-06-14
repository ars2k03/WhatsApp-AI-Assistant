import type { WAMessage } from "@whiskeysockets/baileys";
import { generatedReply } from "../ai brain/ollama.js";
import { addMessage } from "../helper/chat.js";
import { extractMessageData } from "../helper/message.info.js";

export const handleTextMessage = async ( sock: any, msg: WAMessage) => {
  const {chatNumber, userName, text} = extractMessageData(msg);

  await addMessage(msg, {
    role : "user",
    content : text
  })
  
  await sock.sendPresenceUpdate("composing", chatNumber);

  const {type, content, imageBuffer} = await generatedReply(chatNumber ,userName);
  
  if(type === 'image'){

    const buffer = imageBuffer;
    
    await sock.sendMessage(chatNumber, {
      image: buffer,
      caption: `🎨 ${content}`,
    });

  }else{
    await sock.sendMessage(chatNumber, {
      text: content,
    });
  }

  await sock.sendPresenceUpdate("paused", chatNumber);
}