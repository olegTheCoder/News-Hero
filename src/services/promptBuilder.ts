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
    return "Create a magazine cover in The Economist style. Iconic red white black color scheme. Minimalist editorial design.";
  }

  const titles = await Promise.all(newsItems.map((n) => translateToEnglish(n.title)));
  const mainHeadline = titles[0];

  return `Create a magazine cover EXACTLY in The Economist style - the iconic weekly news magazine.

CRITICAL: The main headline is "${mainHeadline}"
Create the most powerful visual representation possible of this exact headline. The illustration MUST directly depict what the headline says - literally and unmistakably.

Essential elements:
- RED horizontal header bar at the TOP (like The Economist masthead in red)
- White background below
- Classic editorial aesthetic

Color palette:
- Only RED (#E60000), BLACK #000000, and WHITE #FFFFFF

Composition:
- Vertical magazine cover portrait format
- Red band at top (20-25% of cover height)
- Large powerful central image that VISUALLY TELLS THE HEADLINE

The illustration MUST show:
- ${mainHeadline}
- Use literal symbolic imagery - show exactly what the headline describes
- If headline is about technology - show prominent tech symbols
- If headline is about security - show relevant security imagery
- Make it UNMISTAKABLE what story this cover represents

Style:
- Editorial news illustration
- Sophisticated intellectual tone
- High-contrast black and white artwork
- Professional magazine quality

Requirements:
- NO text, NO letters, NO words anywhere
- High detail, sharp focus

Negative:
- text, letters, words, numbers, fake text, calligraphy, colorful images, watermarks, logos`;
}