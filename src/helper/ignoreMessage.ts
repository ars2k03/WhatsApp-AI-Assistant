const ignoredChats = new Set([
  "8801795322330@s.whatsapp.net",
]);

export const isIgnoredChat = (chatNumber: string) =>  ignoredChats.has(chatNumber);