export interface SearchSource {
  title: string;
  link: string;
  snippet: string;
  trusted: boolean
}

export type SerperOrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
  date?: string;
  trusted?: boolean;
};


export const trustedDomains: string[] = [
  // News
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "cnn.com",

  // Government / Reference
  "nasa.gov",
  "who.int",
  "un.org",
  "wikipedia.org",
  "britannica.com",

  // Programming
  "github.com",
  "stackoverflow.com",
  "docs.python.org",
  "developer.mozilla.org",
  "nodejs.org",
  "typescriptlang.org",
  "npmjs.com",

  // AI
  "openai.com",
  "anthropic.com",
  "google.dev",
  "ai.google.dev",
  "huggingface.co",

  // Sports
  "espncricinfo.com",
  "iplt20.com",

  // Bangladesh News
  "bdnews24.com",
  "prothomalo.com",
  "thedailystar.net",
  "somoynews.tv",

  "docs.github.com",
  "platform.openai.com",
  "learn.microsoft.com",
  "cloud.google.com",
  "aws.amazon.com",
  "vercel.com",
  "nextjs.org",
  "react.dev",
  "vitejs.dev",
  "expressjs.com",
  "mongodb.com",
  "postgresql.org",
];