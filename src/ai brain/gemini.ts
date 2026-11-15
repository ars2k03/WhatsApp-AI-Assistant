import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import { audioPrompt } from "../system prompt/audio.prompt.js";
import { addMessage, getHistory } from "../helper/chat.js";
import type { WAMessage } from "baileys";
import { extractMessageData } from "../helper/message.info.js";
import type { ChatMessage } from "../config/chat.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  apiVersion: "v1alpha",
  httpOptions: {
    apiVersion: "v1alpha",
    baseUrl: "https://generativelanguage.googleapis.com",
  },
});

const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const INPUT_SAMPLE_RATE = 16000;
const CHUNK_BYTES = INPUT_SAMPLE_RATE * 2 * 0.1;

function toInlineImage(image: string) {
  const data = image.includes("base64,") ? image.split("base64,")[1] : image;
  if (!data) throw new Error("Invalid base64 image");
  return {
    inlineData: {
      mimeType: "image/jpeg",
      data,
    },
  };
}

function historyToTurns(history: ChatMessage[]) {
  return history.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      ...(message.content ? [{ text: message.content }] : []),
      ...(message.images?.map(toInlineImage) ?? []),
    ],
  }));
}

export const generatedReplyAudio = async (
  pcmBuffer: Buffer,
  msg: WAMessage
): Promise<Buffer> => {
  const { userName, chatNumber } = extractMessageData(msg);
  const history = await getHistory(chatNumber);

  const audioChunks: Buffer[] = [];
  const outputTranscriptParts: string[] = [];
  let userTranscript = "";
  let settled = false;
  let session: Awaited<ReturnType<typeof ai.live.connect>> | undefined;

  return new Promise((resolve, reject) => {
    const finish = async (error?: unknown) => {
      if (settled) return;
      settled = true;

      try {
        session?.close();
      } catch {}

      if (error) {
        reject(error);
        return;
      }

      try {
        if (userTranscript.trim()) {
          await addMessage(msg, {
            role: "user",
            content: userTranscript.trim(),
          });
        }

        const aiText = outputTranscriptParts.join("").trim();
        if (aiText) {
          await addMessage(msg, {
            role: "assistant",
            content: aiText,
          });
        }

        resolve(Buffer.concat(audioChunks));
      } catch (saveError) {
        reject(saveError);
      }
    };

    void (async () => {
      try {
        session = await ai.live.connect({
          model: LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: {
              parts: [{ text: audioPrompt(userName) }],
            },
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Aoede",
                },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              console.log("Gemini Live connected ✅");
            },
            onmessage: (message) => {
              const inputText =
                message.serverContent?.inputTranscription?.text;
              if (inputText) {
                userTranscript += inputText;
              }

              const outputText =
                message.serverContent?.outputTranscription?.text;
              if (outputText) {
                outputTranscriptParts.push(outputText);
              }

              const parts = message.serverContent?.modelTurn?.parts;
              if (parts) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    audioChunks.push(
                      Buffer.from(part.inlineData.data, "base64")
                    );
                  }
                }
              }

              if (message.serverContent?.turnComplete) {
                void finish();
              }
            },
            onerror: (error) => {
              console.error("Gemini Live error:", error);
              void finish(error);
            },
            onclose: (event) => {
              console.log("Gemini Live closed:", event.reason);
              if (!settled) {
                void finish(
                  new Error(
                    event.reason ||
                      "Gemini Live closed before turn completed"
                  )
                );
              }
            },
          },
        });

        if (history.length > 0) {
          await session.sendClientContent({
            turns: historyToTurns(history),
            turnComplete: false,
          });
        }

        for (let i = 0; i < pcmBuffer.length; i += CHUNK_BYTES) {
          const chunk = pcmBuffer.subarray(i, i + CHUNK_BYTES);
          await session.sendRealtimeInput({
            audio: {
              data: chunk.toString("base64"),
              mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
            },
          });
        }

        await session.sendRealtimeInput({
          audioStreamEnd: true,
        });
      } catch (error) {
        await finish(error);
      }
    })();
  });
};
