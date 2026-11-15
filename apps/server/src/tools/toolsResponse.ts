import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import type { ChatMessage } from "../config/chat.js";
import { prompt } from "../system prompt/text.prompt.js";

const GROQ_TEXT_MODEL = "openai/gpt-oss-120b";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getFinalResponse(
  userName: string,
  history: ChatMessage[],
  toolData: string,
  query: string
): Promise<string> {
  const finalResponse = await groq.chat.completions.create({
    model: GROQ_TEXT_MODEL,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: prompt(userName),
      },
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content: `Use the following information to answer the user's question.

Rules:
1. Answer ONLY using the information provided below.
2. Never use your own training knowledge.
3. Prioritize facts that appear in multiple sources.
4. If the answer is not available in the data, say: "এই মুহূর্তে সঠিক তথ্য পাওয়া যাচ্ছে না।"

Query: ${query}

Data:
${toolData}`,
      },
    ],
  });

  return (
    finalResponse.choices[0]?.message?.content?.trim() ||
    "এই মুহূর্তে সঠিক তথ্য পাওয়া যাচ্ছে না।"
  );
}
