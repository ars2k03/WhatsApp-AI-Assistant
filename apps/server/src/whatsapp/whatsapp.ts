import makeWASocket from "baileys";
import qrcode from "qrcode-terminal";
import P from "pino";
import { connected } from "../helper/connection.update.js";
import { extractMessageData } from "../helper/message.info.js";
import { isIgnoredChat } from "../helper/ignoreMessage.js";
import { addMessage } from "../helper/chat.js";
import { handleTextMessage } from "../handler/handleText.js";
import { handleImageMessage } from "../handler/handleImage.js";
import {
  clearAuthState,
  enableAuthSave,
  useMongoAuthState,
} from "../helper/mongoAuthState.js";
import collection from "../database/auth.js";
import { handleAudioMessage } from "../handler/handleAudio.js";
import { downloadMedia } from "../helper/media.download.js";
import { Settings } from "../models/settings.model.js";

export let sock: any;

let connecting = false;
let reconnectTimer: NodeJS.Timeout | null = null;

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

async function destroySocket() {
  if (!sock) return;

  try {
    sock.ev.removeAllListeners("creds.update");
    sock.ev.removeAllListeners("connection.update");
    sock.ev.removeAllListeners("messages.upsert");
  } catch {}

  try {
    sock.end(undefined);
  } catch {}

  sock = undefined;
}

function scheduleReconnect(delayMs: number) {
  clearReconnectTimer();
  reconnectTimer = setTimeout(() => {
    void connectToWhatsApp();
  }, delayMs);
}

export async function connectToWhatsApp() {
  if (connecting) return;
  connecting = true;
  clearReconnectTimer();

  try {
    await destroySocket();
    enableAuthSave();

    const { state, saveCreds } = await useMongoAuthState(collection);

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: P({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update: any) => {
      const { connection, qr, lastDisconnect } = update;

      if (qr) {
        qrcode.generate(qr, { small: true });
      }

      connected(connection, lastDisconnect, async (loggedOut) => {
        if (loggedOut) {
          console.log("🚪 Logged out, clearing MongoDB session...");
          await destroySocket();
          await clearAuthState(collection);

          const remaining = await collection.countDocuments();
          console.log(
            remaining === 0
              ? "🧹 Auth session fully deleted. Scan QR again."
              : `⚠️ Auth cleanup incomplete (${remaining} docs left), retrying...`
          );

          if (remaining > 0) {
            await collection.deleteMany({});
          }

          scheduleReconnect(1000);
          return;
        }

        console.log("🔄 Reconnecting...");
        await destroySocket();
        scheduleReconnect(3000);
      });
    });

    sock.ev.on("messages.upsert", async ({ messages }: any) => {
      const msg = messages[0];

      const settings = await Settings.findOne();

      if (!msg?.message) return;

      if (msg.key.remoteJid === "status@broadcast") return;

      const {
        chatId,
        chatNumber,
        lid,
        isMe,
        text,
        imageMessage,
        albumMessage,
        isAlbumChild,
        unsendMessage,
        reactionMessage,
        audioMessage,
        editMessage,
      } = extractMessageData(msg);

      if (!chatId) return;

      if (isIgnoredChat(chatNumber, chatId, lid)) return;

      if (chatId.endsWith("@g.us")) return;

      if (editMessage) return;

      if (albumMessage && !isMe) {
        await sock.sendMessage(chatId, {
          text: `📸 আপনি একসাথে অনেকগুলো ছবি বা ভিডিও পাঠিয়েছেন!\n\nদুঃখিত, এগুলোর উত্তর দেওয়া আমার পক্ষে সম্ভব না। 😔\n\n_Sir আমাকে এই বিষয়ে প্রশিক্ষণ দেননি, তবে তিনি এর উত্তর অনেক ভালোভাবে দিতে পারবেন। 🙂_`,
        });
        return;
      }

      if (isAlbumChild) return;

      if (unsendMessage) return;

      if (reactionMessage) return;

      if (isMe) {
        if (text) {
          await addMessage(msg, {
            role: "assistant",
            content: text,
          });
        }
        return;
      }

      if (settings?.isEnableAi === false) {
        if (text) {
          await addMessage(msg, {
            role: "user",
            content: text,
          });
        } else if (imageMessage) {
          const buffer: any = await downloadMedia(msg, sock);

          await addMessage(msg, {
            role: "user",
            content: imageMessage.caption || "Describe this image",
            images: [buffer.toString("base64")],
          });
        }
        return;
      }

      try {
        if (imageMessage) {
          await handleImageMessage(sock, msg);
        } else if (text) {
          await handleTextMessage(sock, msg);
        } else if (audioMessage) {
          await handleAudioMessage(msg, sock);
        }
      } catch (e) {
        console.error(e);

        await sock.sendMessage(chatId, {
          text: "দুঃখিত স্যার/ম্যাডাম, এই মুহূর্তে আমি উত্তর করতে পারছি না।",
        });
      }
    });

    return sock;
  } finally {
    connecting = false;
  }
}

connectToWhatsApp();
