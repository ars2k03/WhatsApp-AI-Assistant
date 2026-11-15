import { proto } from "baileys";

export type MessageInfo = {
  chatId: string;
  chatNumber: string;
  lid?: string | undefined;
  userName: string;
  isMe: boolean;

  text?: string;

  imageMessage?: proto.Message.IImageMessage | null;
  albumMessage?: proto.Message.IAlbumMessage | null;

  isAlbumChild: boolean;
  unsendMessage: boolean;
  reactionMessage: proto.Message.IReactionMessage | null;
  audioMessage: proto.Message.IAudioMessage | null;
  editMessage: proto.Message.ISecretEncryptedMessage | null;
};

function isPhoneJid(jid?: string | null): jid is string {
  return Boolean(
    jid && (jid.endsWith("@s.whatsapp.net") || jid.endsWith("@c.us"))
  );
}

function isLidJid(jid?: string | null): jid is string {
  return Boolean(jid && jid.endsWith("@lid"));
}

export function extractMessageData(msg: any): MessageInfo {
  const remoteJid = msg.key.remoteJid as string | undefined;
  const remoteJidAlt = msg.key.remoteJidAlt as string | undefined;

  const phoneJid =
    [remoteJid, remoteJidAlt].find(isPhoneJid) ?? undefined;
  const lid = [remoteJid, remoteJidAlt].find(isLidJid) ?? undefined;

  return {
    chatId: remoteJid || phoneJid || lid || "",
    chatNumber: phoneJid || lid || remoteJid || "",
    lid,
    userName: msg.pushName || "Sir/Madam",
    isMe: msg.key.fromMe,

    text:
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text,

    imageMessage: msg.message?.imageMessage,
    albumMessage: msg.message?.albumMessage,

    isAlbumChild:
      msg.message?.messageContextInfo?.messageAssociation?.associationType ===
      proto.MessageAssociation.AssociationType.MEDIA_ALBUM,

    unsendMessage: !!msg?.message?.protocolMessage,

    reactionMessage: msg?.message?.reactionMessage,

    audioMessage: msg?.message?.audioMessage,

    editMessage: msg?.message?.secretEncryptedMessage,
  };
}
