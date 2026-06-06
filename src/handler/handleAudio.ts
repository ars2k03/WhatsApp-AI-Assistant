import type { WAMessage } from "@whiskeysockets/baileys";
import { downloadMedia } from "../helper/media.download.js";
import { generatedReplyAudio } from "../ai brain/gemini.js";
import { extractMessageData } from "../helper/message.info.js";
import { oggToPcm } from "../converter/oggToPcm.js";
import { pcmToOgg } from "../converter/pcmToOgg.js";

export const handleAudioMessage = async (msg: WAMessage, sock: any) => {

    const {chatId} = extractMessageData(msg);

    try {

        await sock.sendPresenceUpdate("recording", chatId);

        const oggBuffer = await downloadMedia(msg, sock);

        const pcmBuffer = await oggToPcm(oggBuffer);

        const replyPcmBuffer = await generatedReplyAudio(pcmBuffer, msg);

        const replyOggBuffer = await pcmToOgg(replyPcmBuffer);

        await sock.sendMessage(chatId, {
            audio: replyOggBuffer,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true, 
        });

        await sock.sendPresenceUpdate("paused", chatId);

    } catch (err) {

        console.error("handleAudioMessage error:", err);

        await sock.sendMessage(chatId, {
            text: "দুঃখিত, অডিও প্রসেস করতে সমস্যা হয়েছে। 😔",
        });

    }
};