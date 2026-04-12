const RSS2JSON_API = "https://rss2json.com/api.json?rss_url=";

const RSS_SOURCES = [
  "https://lenta.ru/rss/",
  "https://ria.ru/export/rss2/archive/index.xml",
];

export interface RssItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image?: string;
  category: string;
  source: string;
}

export async function fetchLatestNews(): Promise<RssItem[]> {
  const results: RssItem[] = [];

  for (const url of RSS_SOURCES) {
    try {
      const sourceName = url.includes("lenta") ? "Lenta.ru" : "RIA";
      const response = await fetch(RSS2JSON_API + encodeURIComponent(url));
      
      if (!response.ok) continue;

      const data = await response.json();
      
      if (data.status !== "ok" || !data.items) continue;

      for (let i = 0; i < Math.min(data.items.length, 5); i++) {
        const item = data.items[i];
        
        if (!item.title || !item.link) continue;

        const image = item.enclosure?.link || item.thumbnail || "";

        results.push({
          id: `${sourceName}-${i}-${btoa(item.link).slice(-10)}`,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: (item.description || "").replace(/<[^>]*>/g, "").slice(0, 200),
          image,
          category: item.categories?.[0] || "Россия",
          source: sourceName,
        });
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }

  results.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return results.slice(0, 10);
}

export function categorizeNews(item: RssItem): "ЖЕЛЕЗО" | "БЕЗОПАСНОСТЬ" | "ПО" | "ИНФРА" | "УПРАВЛЕНИЕ" {
  const text = `${item.title} ${item.description} ${item.category}`.toLowerCase();
  
  const keywords = {
    "ЖЕЛЕЗО": ["технологи", "hardware", "процессор", "чип", "компьютер", "chip", "processor", "ai model", "модель ии", "gpu", "nvidia", "инновац", "наука"],
    "БЕЗОПАСНОСТЬ": ["безопасност", "хакер", "взлом", "кибер", "защит", "security", "hack", "attack", "утечка", "полиция", "мчс", "спецслужб"],
    "ПО": ["софт", "программ", "app", "software", "приложени", "release", "update", "версия", "культура", "фильм", "музык"],
    "ИНФРА": ["инфраструктур", "дата-центр", "сервер", "облако", "network", "интернет", "провайдер", "экономик", "бизнес", "рынок"],
    "УПРАВЛЕНИЕ": ["правительств", "власть", "закон", "регулирован", "политик", "govern", "policy", "парламент", "президент", "губернатор", "дума"],
  };

  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(w => text.includes(w))) {
      return cat as "ЖЕЛЕЗО" | "БЕЗОПАСНОСТЬ" | "ПО" | "ИНФРА" | "УПРАВЛЕНИЕ";
    }
  }

  return "УПРАВЛЕНИЕ";
}