import { generatedReply } from "../ai brain/ollama.js";
import { saveHistory, type ChatMessage } from "../helper/cofig.js";

export const handleTextMessage = async ( sock: any, chatId: string, history: ChatMessage[], userName: string, text : string) => {

  history.push({
    role: "user",
    content: text,
  });

  saveHistory(chatId, history);

  await sock.sendPresenceUpdate("composing", chatId);

  const reply = await generatedReply(history,userName);
  
  await sock.sendMessage(chatId, {
    text: reply,
  });

  await sock.sendPresenceUpdate("paused", chatId);
}