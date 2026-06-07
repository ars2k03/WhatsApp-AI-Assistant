import type { WAMessage } from "@whiskeysockets/baileys";
import { generatedReply } from "../ai brain/ollama.js";
import { downloadMedia } from "../helper/media.download.js";
import { addMessage } from "../helper/chat.js";
import { extractMessageData } from "../helper/message.info.js";

export const handleImageMessage = async ( sock: any, msg: WAMessage) => {
    const {chatId, userName, imageMessage} = extractMessageData(msg);
    
    const buffer : any = await downloadMedia(msg, sock);
    
    await addMessage(msg, {
        role: "user",
        content: imageMessage.caption || "Describe this image",
        images: [buffer.toString("base64")]
    })
    
    await sock.sendPresenceUpdate("composing", chatId);

    const {type, imageBuffer, content} = await generatedReply(chatId, userName);

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