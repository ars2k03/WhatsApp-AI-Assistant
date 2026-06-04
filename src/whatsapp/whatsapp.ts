import makeWASocket from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import P from "pino";
import { connected } from "../helper/connection.update.js";
import { extractMessageData } from "../helper/message.info.js";
import { isIgnoredChat } from "../helper/ignoreMessage.js";
import { addMessage } from "../helper/chat.js";
import {handleTextMessage } from "../handler/handleText.js";
import { handleImageMessage } from "../handler/handleImage.js";
import { useMongoAuthState } from "../helper/mongoAuthState.js";
import collection from "../database/auth.js";

let isEnableAi = true;

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMongoAuthState(collection);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on( "connection.update", async (update) => {
      const {connection, qr, lastDisconnect} = update;

      if (qr) {
        qrcode.generate(qr, {small: true});
      }

      connected(connection!, lastDisconnect, connectToWhatsApp);

  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0];

      if (!msg?.message) return;

      const {chatId, chatNumber, isMe, text, imageMessage, albumMessage, isAlbumChild, unsendMessage, reactionMessage} = extractMessageData(msg);

      if (!chatId) return;

      if (isIgnoredChat(chatNumber)) return;

      if (chatId.endsWith("@g.us")) return;

      if (albumMessage && !isMe) {

        await sock.sendMessage(chatId, {
          text: `📸 আপনি একসাথে অনেকগুলো ছবি বা ভিডিও পাঠিয়েছেন!\n\nদুঃখিত, এগুলোর উত্তর দেওয়া আমার পক্ষে সম্ভব না। 😔\n\n_A R S Arafat আমাকে এই বিষয়ে প্রশিক্ষণ দেননি, তবে তিনি এর উত্তর অনেক ভালোভাবে দিতে পারবেন। 🙂_`
        });

        return;

      }

      if (isAlbumChild) return; 

      if (unsendMessage) return;

      if(reactionMessage) return;
      
      if (isMe) {

        if ( text === '.ai') {
          isEnableAi = !isEnableAi;

          await sock.sendMessage(chatId, {
            text: `🤖 *A R S AI* is ${isEnableAi ? 'Enabled' : 'Disabled'}`
          });

          return;
        }

        if(text && text !== `🤖 *A R S AI* is ${isEnableAi ? 'Enabled' : 'Disabled'}` && isEnableAi) {

          await addMessage(msg, {
            role: "assistant",
            content: text,
          })
          
        }

        return;
      };

      if(!isEnableAi) return;

      try{

        if(imageMessage){

          await handleImageMessage(sock, msg);

        }else if(text) {

          await handleTextMessage(sock, msg)

        }else {
          await sock.sendMessage(chatId, {
            text: `আমি শুধু টেক্সট ও ছবি বুঝতে পারি। 😊\n\n_Arafat sir এখন উপস্থিত নেই, তিনি এর উত্তর আরও ভালো দিতে পারবেন।_`,
          });
        }

      }catch(e){

        console.error(e);

        await sock.sendMessage(chatId, {
            text: "দুঃখিত স্যার/ম্যাডাম, এই মুহূর্তে আমি উত্তর করতে পারছি না।",
        });
        
      }
    }
  );

  return sock;
}

connectToWhatsApp();