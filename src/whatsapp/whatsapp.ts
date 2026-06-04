import makeWASocket, { useMultiFileAuthState} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import P from "pino";
import { connected } from "../helper/connection.update.js";
import { extractMessageData } from "../helper/message.info.js";
import { isIgnoredChat } from "../helper/ignoreMessage.js";
import { getHistory, saveHistory } from "../helper/cofig.js";
import {handleTextMessage } from "../handler/handleText.js";
import { handleImageMessage } from "../handler/handleImage.js";
import { downloadMedia } from "../helper/media.download.js";

let isEnableAi = true;

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("WhatsApp_Auth");

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

      const {chatId, chatNumber, userName, text, imageMessage} = extractMessageData(msg);

      if (!chatId) return;

      if (isIgnoredChat(chatNumber)) return;

      if (chatId.endsWith("@g.us")) return;

      const history = getHistory(chatId);

      if (msg.key.fromMe) {
        if ( text === '.ai') {
          isEnableAi = !isEnableAi;

          await sock.sendMessage(chatId, {
            text: `🤖 *A R S AI* is ${isEnableAi ? 'Enabled' : 'Disabled'}`
          });

          return;
        }

        if(imageMessage){
          const buffer : any = await downloadMedia(msg, sock);
              
          history.push({
            role: "user",
            content: imageMessage.caption || "Describe this image",
            images: [buffer.toString("base64")]
          })

        }else{

          history.push({
            role: "assistant",
            content: text,
          });
          
        }

        saveHistory(chatId, history);

        return;
      };

      if(!isEnableAi) return;

      try{

        if(imageMessage){

          await handleImageMessage(sock, msg, chatId, history, userName, imageMessage);

        }else if(text) {

          await handleTextMessage(sock, chatId, history, userName, text)

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