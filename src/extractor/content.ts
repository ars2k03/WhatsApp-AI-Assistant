import * as cheerio from "cheerio";

export async function fetchPageContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!res.ok) return "";

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $("script, style, noscript, nav, footer, header, aside, iframe, form").remove();
    $("[class*='ad'], [id*='ad'], [class*='cookie'], [class*='popup']").remove();

    // Try selectors in priority order — fix: check .length, not truthy string
    const selectors = [
      "article",
      "main",
      '[role="main"]',
      ".post-content",
      ".article-body",
      ".entry-content",
      "#content",
      "body",
    ];

    let text = "";
    for (const selector of selectors) {
      const el = $(selector);
      if (el.length > 0) {
        const raw = el.text().replace(/\s+/g, " ").trim();
        if (raw.length > 100) {
          text = raw;
          break;
        }
      }
    }

    return text.slice(0, 5000);
  } catch {
    return "";
  }
}