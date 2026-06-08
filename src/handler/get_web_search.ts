import { tavily } from "@tavily/core";
import dotenv from "dotenv";
import type { SearchResult } from "../config/websearch.js";
dotenv.config();

const client = tavily({
  apiKey: process.env.SEARCH_API_KEY as string,
});

export async function handleWebSearch(query: string): Promise<SearchResult> {
  try {
    const response = await client.search(query, {
      searchDepth: "basic",
      maxResults: 10,
    });

    if (!response.results.length) {
      return {
        content: `${query} এর কোনো তথ্য খুঁজে পাওয়া যায়নি।`,
        sources: [],
      };
    }

    const content = response.results
      .map((r) => `Title: ${r.title}\nContent: ${r.content}`)
      .join("\n\n---\n\n");

    const sources = response.results.map((r) => r.url);

    console.log(`Search : ${query}`);

    return { content, sources };

  } catch (error) {
    console.error("Search error:", error);
    return {
      content: "ওয়েব সার্চ করতে ব্যর্থ হয়েছি।",
      sources: [],
    };
  }
}