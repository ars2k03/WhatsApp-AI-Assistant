export const chats = new Map();

export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    images?: string[];
};

export const greet = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good Night';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
}

export function getHistory(chatId: string) {
  return chats.get(chatId) || [];
}

export function saveHistory(chatId: string, history: ChatMessage[]) {
  if (history.length > 20) {
    history.splice(0, history.length - 20);
  }

  chats.set(chatId, history);
}