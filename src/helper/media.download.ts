import { downloadMediaMessage, type WAMessage } from "@whiskeysockets/baileys";
import P from "pino";

export const downloadMedia = async ( msg: WAMessage, sock: any ) => {
  return await downloadMediaMessage(msg, "buffer",{}, {
    logger: P({ level: "silent" }),
    reuploadRequest: sock.updateMediaMessage,
  });
}