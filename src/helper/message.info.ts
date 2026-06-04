import { proto } from "@whiskeysockets/baileys";

export type MessageInfo = {
  chatId: string;
  chatNumber: string;
  userName: string;
  isMe: boolean;

  text?: string;

  imageMessage?: proto.Message.IImageMessage | null;
  albumMessage?: proto.Message.IAlbumMessage | null;

  isAlbumChild: boolean;
  unsendMessage: boolean;
  reactionMessage : proto.Message.IAlbumMessage | null;
};

export function extractMessageData(msg: any) {
  return {
    chatId: msg.key.remoteJid,
    chatNumber: msg.key.remoteJidAlt || msg.key.remoteJid,
    userName: msg.pushName || "Sir/Madam",
    isMe : msg.key.fromMe,

    text:
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text,

    imageMessage: msg.message?.imageMessage,
    albumMessage : msg.message?.albumMessage,

    isAlbumChild : msg.message?.messageContextInfo
            ?.messageAssociation?.associationType === 
            proto.MessageAssociation.AssociationType.MEDIA_ALBUM,

    unsendMessage : !! msg.message?.protocolMessage ,
    
    reactionMessage : msg?.message?.reactionMessage
  };
}