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

  const reply = await generatedReply(chatId,userName);
  
  await sock.sendMessage(chatId, {
    text: reply,
  });

  await sock.sendPresenceUpdate("paused", chatId);
}