import type { NewsItem } from "../types";

async function translateToEnglish(text: string): Promise<string> {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0]?.map((t: string[]) => t[0]).join("") || text;
  } catch {
    return text;
  }
}

export async function buildPrompt(
  newsItems: NewsItem[]
): Promise<string> {
  if (newsItems.length === 0) {
    return "Create a conceptual editorial magazine cover inspired by The Economist";
  }

  const titles = await Promise.all(newsItems.map((n) => translateToEnglish(n.title)));
  const headlines = titles.join(". ");

  return headlines;
}