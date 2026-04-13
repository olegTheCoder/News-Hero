import type { NewsItem } from "../types";

export function buildPrompt(
  newsItems: NewsItem[]
): string {
  if (newsItems.length === 0) {
    return "Create a conceptual editorial magazine cover inspired by The Economist";
  }

  const newsDetails = newsItems.map((n) => {
    let detail = `- ${n.title}`;
    if (n.category) detail += ` (${n.category})`;
    return detail;
  }).join("\n");

  return `Create a conceptual editorial magazine cover inspired by The Economist: bold, minimal, symbolic, geopolitical, economic, witty, and visually intelligent.

The cover must illustrate these specific news stories:
${newsDetails}

IMPORTANT: The visual concept must directly reflect the actual news content above. Each chosen headline must be represented through specific visual metaphors in the artwork.

For example:
- If news is about Trump tariff war → show symbolic trade war elements
- If news is about tech/AI → show relevant technology symbols
- If news is about economy → show financial/economic symbols
- If news is about Russia/Ukraine → show relevant geopolitical symbols
- If news is about climate → show environmental symbols

Create a striking visual metaphor where central figure represents the main character embodying the news narrative. The figure should be interacting with symbolic elements that represent the specific headlines.

Style requirements:
- Economist-like cover design language
- clean editorial composition
- smart visual metaphor (NOT literal illustration)
- dramatic but restrained
- highly polished, print-magazine quality
- professional portrait / business style

Composition:
- vertical magazine cover format
- centered protagonist figure
- strong silhouette
- top masthead zone (leave clear space for headline text)
- red border frame
- minimal background
- striking symbolic objects clearly representing the chosen news

Technical requirements:
- high detail, sharp focus
- proper lighting and depth of field
- magazine print quality
- NO TEXT inside the image (leave space for masthead)

Negative prompt:
extra characters, weak composition, bad anatomy, childish illustration, noisy background, comedic meme aesthetic, generic corporate stock look, fantasy costume, low-resolution details, text artifacts, watermarks`;
}
