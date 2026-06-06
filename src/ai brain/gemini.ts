import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import { audioPrompt } from "../system prompt/audio.prompt.js";
import { addMessage } from "../helper/chat.js";
import type { WAMessage } from "@whiskeysockets/baileys";
import { extractMessageData } from "../helper/message.info.js";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const CHUNK_SIZE = 24000 * 2 * 0.1;

export const generatedReplyAudio = async (pcmBuffer : Buffer, msg : WAMessage) : Promise <Buffer> => {

    const {userName} = extractMessageData(msg);
    const audioChunks: Buffer[] = [];
    const outputTranscriptParts: string[] = [];


    return new Promise(async (resolve, reject) => {

        const session = await ai.live.connect({
            model: "gemini-3.1-flash-live-preview",

            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction : {
                    parts : [{
                        text: audioPrompt(userName)
                    }]
                },
                speechConfig : {
                    voiceConfig : {
                        prebuiltVoiceConfig : {
                            voiceName : "Aoede",
                        }
                    }
                }
            },

            callbacks: {
                onopen: () => {
                    console.log("Connected ✅");
                },

                onmessage: async (message) => {

                    // User speech transcription
                    if (message.serverContent?.inputTranscription?.text) {

                        const text = message.serverContent.inputTranscription.text;

                        await addMessage(msg, {
                            role : 'user',
                            content : text
                        });

                    }

                    if (message.serverContent?.outputTranscription?.text) {

                        outputTranscriptParts.push(message.serverContent.outputTranscription.text);
                    }

                    // Collect audio chunks
                    const parts = message.serverContent?.modelTurn?.parts;

                    if (parts) {

                        for (const part of parts) {

                            if (part.inlineData?.data) {

                                audioChunks.push(Buffer.from(part.inlineData.data, "base64"));

                            }

                        }
                    }

                    // Final audio received
                    if (message.serverContent?.turnComplete) {

                        const aiText = outputTranscriptParts.join("");
                        
                        await addMessage(msg, { 
                            role: 'assistant', 
                            content: aiText 
                        });

                        const finalPcm = Buffer.concat(audioChunks);
                        resolve(finalPcm);
                        session.close();
                    }

                },

                onerror: (error) => {

                    console.error("ERROR:", error);
                    reject(error);

                },

                onclose: (event) => {

                    console.log("Closed:", event.reason);

                },
            },
        });

        //Send audio chunk in gemini
        for (let i = 0; i < pcmBuffer.length; i += CHUNK_SIZE) {
            const chunk = pcmBuffer.subarray(i, i + CHUNK_SIZE);
            await session.sendRealtimeInput({
                audio: {
                    data: chunk.toString("base64"),
                    mimeType: "audio/pcm;rate=24000",
                },
            });
        }

        // Tell Gemini audio stream is finished
        await session.sendRealtimeInput({

            audioStreamEnd: true,

        });
    });
}
