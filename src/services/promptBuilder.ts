import type { NewsItem } from "../types";

const NEWS_KEYWORDS: Record<string, string> = {
  ЖЕЛЕЗО: "quantum computing breakthrough",
  БЕЗОПАСНОСТЬ: "AI cybersecurity attack",
  ПО: "synthetic coding revolution",
  ИНФРА: "orbital data centers in space",
  УПРАВЛЕНИЕ: "AI ethics algorithm governance",
};

const STYLE_SUFFIX =
  "cyberpunk editorial illustration, acid lime and neon purple, high contrast, sharp mechanical details, dark background, newspaper cover art";

export function buildPrompt(
  imageDescription: string,
  newsItems: NewsItem[]
): string {
  const heroDesc = imageDescription
    ? `photo of ${imageDescription} as the main hero character`
    : "a futuristic news hero character";

  const scenes = newsItems
    .map((n) => NEWS_KEYWORDS[n.category] ?? "breaking news event")
    .join(", ");

  return `${heroDesc} starring in a dramatic scene about ${scenes}. ${STYLE_SUFFIX}`;
}
