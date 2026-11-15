import type { WAMessage } from "baileys";
import { Chat } from "../models/chat.model.js";
import { extractMessageData } from "./message.info.js";
import type { ChatMessage } from "../config/chat.js";

export const greet = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Dhaka",
    }).format(new Date())
  );

  if (hour >= 21 || hour < 5) return "Good Night";
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour <= 17) return "Good Afternoon";
  return "Good Evening";
};

function identityFilter(chatNumber: string, chatId?: string, lid?: string) {
  const ids = [...new Set([chatNumber, chatId, lid].filter(Boolean) as string[])];
  return {
    $or: [{ chatNumber: { $in: ids } }, { chatId: { $in: ids } }],
  };
}

export async function getHistory(chatNumber: string) {
  const chat = await Chat.findOne({
    $or: [{ chatNumber }, { chatId: chatNumber }],
  }).lean();

  return chat?.history || [];
}

export async function addMessage(msg: WAMessage, message: ChatMessage) {
  const { chatId, chatNumber, lid } = extractMessageData(msg);

  if (!chatNumber) return;

  const filter = identityFilter(chatNumber, chatId, lid);
  const chats = await Chat.find(filter);

  if (chats.length > 0) {
    const primary = chats[0]!;
    const mergedHistory = chats.flatMap((chat) =>
      chat.history.map((item) => ({
        role: item.role,
        content: item.content,
        images: item.images,
      }))
    );

    primary.chatNumber = chatNumber;
    primary.chatId = chatId;
    primary.history.splice(
      0,
      primary.history.length,
      ...[...mergedHistory, message].slice(-20)
    );

    const duplicateIds = chats.slice(1).map((chat) => chat._id);
    if (duplicateIds.length) {
      await Chat.deleteMany({ _id: { $in: duplicateIds } });
    }

    await primary.save();
    return;
  }

  await Chat.create({
    chatId,
    chatNumber,
    history: [message],
  });
}
