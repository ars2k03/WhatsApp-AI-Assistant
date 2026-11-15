import type { WAMessage } from "baileys";
import { generatedReply } from "../ai brain/groq.js";
import { downloadMedia } from "../helper/media.download.js";
import { addMessage } from "../helper/chat.js";
import { extractMessageData } from "../helper/message.info.js";

export const handleImageMessage = async (sock: any, msg: WAMessage) => {
  const { chatId, chatNumber, userName, imageMessage } = extractMessageData(msg);

  if (!chatId || !imageMessage) return;

  const buffer = await downloadMedia(msg, sock);

  await addMessage(msg, {
    role: "user",
    content: imageMessage.caption || "Describe this image",
    images: [buffer.toString("base64")],
  });

  await sock.sendPresenceUpdate("composing", chatId);

  const { type, imageBuffer, content } = await generatedReply(
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
