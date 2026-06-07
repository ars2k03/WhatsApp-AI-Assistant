import dotenv from "dotenv";
dotenv.config();
import {trustedDomains, type SerperOrganicResult } from "../config/websearch.js";

function getHostname(link: string): string | null {
  try {
    return new URL(link).hostname;
  } catch {
    return null;
  }
}

function isTrusted(link: string): boolean {
  const hostname = getHostname(link);

  if (!hostname) return false;

  return trustedDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

export async function handleWebSearch(
  query: string
): Promise<string> {
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: 10,
      }),
      signal: AbortSignal.timeout(7000),
    });

    if (!res.ok) {
      throw new Error(
        `Serper API error: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    let summary = `User Query: ${query}\n\n`;

    // Direct Answer
    if (data.answerBox?.answer) {
      summary += `Direct Answer: ${data.answerBox.answer}\n\n`;
    } else if (data.answerBox?.snippet) {
      summary += `Direct Answer: ${data.answerBox.snippet}\n\n`;
    }

    // Knowledge Graph
    if (data.knowledgeGraph?.description) {
      summary += `Knowledge: ${data.knowledgeGraph.description}\n\n`;
    }

    if (!Array.isArray(data.organic) || data.organic.length === 0) {
      return summary.trim() ||`"${query}" সম্পর্কে কোনো তথ্য পাওয়া যায়নি।`;
    
    }

    const tagged: (SerperOrganicResult & { trusted: boolean })[] =
      data.organic
        .filter(
          (item: SerperOrganicResult) =>
            typeof item.link === "string" &&
            item.link.startsWith("http") &&
            item.title &&
            item.snippet
        )
        .map((item: SerperOrganicResult) => ({
          ...item,
          trusted: isTrusted(item.link!),
        }));

    // Remove duplicate domains
    const seenDomains = new Set<string>();

    const uniqueResults = tagged.filter((item) => {
      const hostname = getHostname(item.link!);

      if (!hostname || seenDomains.has(hostname)) {
        return false;
      }

      seenDomains.add(hostname);
      return true;
    });

    // Trusted sources first
    uniqueResults.sort(
      (a, b) => Number(b.trusted) - Number(a.trusted)
    );

    const topResults = uniqueResults.slice(0, 5);

    for (const [index, item] of topResults.entries()) {
      summary += `[Result ${index + 1}]\n`;

      summary += `Title: ${item.title}\n`;

      if (item.date) {
        summary += `Date: ${item.date}\n`;
      }

      summary += `Snippet: ${item.snippet}\n`;

      summary += `Trusted Source: ${
        item.trusted ? "Yes" : "No"
      }\n\n`;
    }

    return summary.trim();
  } catch (error) {
    console.error("Search error:", error);

    return "ওয়েব সার্চ করতে ব্যর্থ হয়েছি।";
  }
}