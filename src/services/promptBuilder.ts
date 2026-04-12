import type { NewsItem } from "../types";

const SCENE_KEYWORDS: Record<string, string> = {
  "ЖЕЛЕЗО": "high-tech laboratory, quantum computer, server room",
  "БЕЗОПАСНОСТЬ": "cybersecurity command center, digital fortress",
  "ПО": "modern office, tech startup workspace",
  "ИНФРА": "data center, network hub",
  "УПРАВЛЕНИЕ": "government building, political summit, conference hall",
  "СПОРТ": "sports arena, stadium, tennis court",
  "ВОЙНА": "military base, defense position",
};

export function buildPrompt(
  _imageDescription: string,
  newsItems: NewsItem[]
): string {
  const newsText = newsItems.map((n) => n.title).join(". ");

  const scenes = newsItems
    .slice(0, 2)
    .map((n) => SCENE_KEYWORDS[n.category] || "breaking news environment")
    .join(" and ");

  return `Same person from uploaded photo as main character. ${newsText}. ` +
    `Background: ${scenes}. ` +
    `Professional news photo, realistic style, high quality, ` +
    `keep the person's face and features unchanged`;
}