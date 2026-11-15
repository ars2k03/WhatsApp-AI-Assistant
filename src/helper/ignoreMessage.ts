const ignoredChats = new Set([
  "8801795322330@s.whatsapp.net",
]);

export const isIgnoredChat = (...ids: Array<string | undefined>) =>
  ids.some((id) => Boolean(id && ignoredChats.has(id)));
