import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import dotenv from "dotenv";
dotenv.config();
import { getHistory, greet } from "../helper/chat.js";
import { prompt } from "../system prompt/text.prompt.js";
import { tools } from "../tools/tools.js";
import { generatedIamge } from "./pollinations.js";
import type { ChatMessage } from "../config/chat.js";
import type { Reply } from "../config/reply.js";
import { handleGetWeather } from "../handler/get_weather.js";
import { handleWebSearch } from "../handler/get_web_search.js";
import { getFinalResponse } from "../tools/toolsResponse.js";

const GROQ_TEXT_MODEL = "openai/gpt-oss-120b";
const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function toDataUrl(image: string): string {
  if (image.startsWith("data:")) return image;
  if (image.includes("base64,")) {
    const data = image.split("base64,")[1] ?? image;
    return `data:image/jpeg;base64,${data}`;
  }
  return `data:image/jpeg;base64,${image}`;
}

function toGroqMessages(history: ChatMessage[]): ChatCompletionMessageParam[] {
  return history.map((message) => {
    if (message.role === "assistant") {
      return {
        role: "assistant" as const,
        content: message.content,
      };
    }

    if (message.images?.length) {
      return {
        role: "user" as const,
        content: [
          { type: "text" as const, text: message.content },
          ...message.images.map((image) => ({
            type: "image_url" as const,
            image_url: { url: toDataUrl(image) },
          })),
        ],
      };
    }

    return {
      role: "user" as const,
      content: message.content,
    };
  });
}

function formatSources(sources: string[]): string {
  if (!sources.length) return "";

  return (
    "\n\n━━━━━━━━━━━━━━━\n🌐 *Sources*\n\n" +
    sources
      .map((url, index) => {
        const domain =
          new URL(url).hostname.replace("www.", "").split(".")[0] ?? url;
        return `${index + 1}. *${domain}*\n\n🔗${url}`;
      })
      .join("\n\n")
  );
}

export async function generatedReply(
  chatNumber: string,
  userName: string
): Promise<Reply> {
  const history = await getHistory(chatNumber);

  if (history.length === 1) {
    return {
      type: "text",
      content: `${greet()} ${userName}! 👋\n\nআমি *Zara*, স্যারের AI Assistant 🤖 বলুন, আমি কীভাবে আপনাকে সাহায্য করতে পারি? 😊`,
    };
  }

  const hasImages = history.some((message) => Boolean(message.images?.length));
  const model = hasImages ? GROQ_VISION_MODEL : GROQ_TEXT_MODEL;

  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.6,
      messages: [
        { role: "system", content: prompt(userName) },
        ...toGroqMessages(history),
      ],
      tools,
      tool_choice: "auto",
    });

    const message = completion.choices[0]?.message;

    if (!message) {
      return {
        type: "text",
        content: "Something went wrong. Please try again later",
      };
    }

    const toolCall = message.tool_calls?.[0];

    if (toolCall?.type === "function") {
      const { name, arguments: rawArgs } = toolCall.function;
      let args: Record<string, string> = {};

      try {
        args = JSON.parse(rawArgs || "{}") as Record<string, string>;
      } catch {
        return {
          type: "text",
          content: "Something went wrong. Please try again later",
        };
      }

      if (name === "generate_image") {
        const imagePrompt = args.prompt;

        if (!imagePrompt) {
          return { type: "text", content: "Something went wrong." };
        }

        const imageBuffer = await generatedIamge(imagePrompt);

        if (!imageBuffer) {
          return {
            type: "text",
            content: "Image generation failed. Please try again later",
          };
        }

        return {
          type: "image",
          imageBuffer,
          content: imagePrompt,
        };
      }

      if (name === "web_search") {
        if (!args.query) {
          return { type: "text", content: "Something went wrong." };
        }

        const searchResult = await handleWebSearch(args.query);
        const content = await getFinalResponse(
          userName,
          history,
          searchResult.content,
          args.query
        );

        return {
          type: "text",
          content: content + formatSources(searchResult.sources),
        };
      }

      if (name === "get_weather") {
        if (!args.location) {
          return { type: "text", content: "Something went wrong." };
        }

        const weatherResult = await handleGetWeather(args.location);
        const content = await getFinalResponse(
          userName,
          history,
          weatherResult,
          args.location
        );

        return { type: "text", content };
      }
    }

    return {
      type: "text",
      content:
        message.content?.trim() ||
        "দুঃখিত, এই মুহূর্তে আমি উত্তর করতে পারছি না। কিছুক্ষণ পর আবার চেষ্টা করুন",
    };
  } catch (error) {
    console.error("Groq API error:", error);
    return {
      type: "text",
      content:
        "দুঃখিত, এই মুহূর্তে আমি উত্তর করতে পারছি না। কিছুক্ষণ পর আবার চেষ্টা করুন",
    };
  }
}
