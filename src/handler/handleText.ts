import type { WAMessage } from "baileys";
import { generatedReply } from "../ai brain/groq.js";
import { addMessage } from "../helper/chat.js";
import { extractMessageData } from "../helper/message.info.js";

export const handleTextMessage = async (sock: any, msg: WAMessage) => {
  const { chatId, chatNumber, userName, text } = extractMessageData(msg);

  if (!chatId || !text) return;

  await addMessage(msg, {
    role: "user",
    content: text,
  });

  await sock.sendPresenceUpdate("composing", chatId);

  const { type, content, imageBuffer } = await generatedReply(
    chatNumber,
    userName
  );

  if (type === "image") {
    await sock.sendMessage(chatId, {
      image: imageBuffer,
      caption: `🎨 ${content}`,
    });
  } else {
    await sock.sendMessage(chatId, {
      text: content,
    });
  }

  await addMessage(msg, {
    role: "assistant",
    content,
  });

  await sock.sendPresenceUpdate("paused", chatId);
};
