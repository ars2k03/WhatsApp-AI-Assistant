export function extractMessageData(msg: any) {
  return {
    chatId: msg.key.remoteJid,
    chatNumber: msg.key.remoteJidAlt || msg.key.remoteJid,
    userName: msg.pushName || "Sir/Madam",
    text:
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text,
    imageMessage: msg.message?.imageMessage,
  };
}