import type { WAMessage } from "@whiskeysockets/baileys";
import { generatedReply } from "../ai brain/ollama.js";
import { saveHistory, type ChatMessage } from "../helper/cofig.js";
import { downloadMedia } from "../helper/media.download.js";

export const handleImageMessage = async ( sock: any, msg: WAMessage, chatId: string, history: ChatMessage[], userName: string, imageMessage: any ) => {
    const buffer : any = await downloadMedia(msg, sock);
    
    history.push({
        role: "user",
        content: imageMessage.caption || "Describe this image",
        images: [buffer.toString("base64")]
    })
    
    saveHistory(chatId, history);

    await sock.sendPresenceUpdate("composing", chatId);

    const reply = await generatedReply(history, userName);

    await sock.sendMessage(chatId, {
        text: reply
    });

    await sock.sendPresenceUpdate("paused", chatId);
}