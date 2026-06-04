import { generatedReply } from "../ai brain/ollama.js";
import { addMessage } from "../helper/cofig.js";

export const handleTextMessage = async ( sock: any, chatId: string, userName: string, text : string, chatNumber : string) => {

  await addMessage(chatId, chatNumber, {
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