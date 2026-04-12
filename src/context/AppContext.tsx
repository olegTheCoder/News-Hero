import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { NewsItem } from "../types";
import { fetchLatestNews, categorizeNews, type RssItem } from "../services/newsFetcher";

interface AppState {
  uploadedFile: File | null;
  uploadedPreview: string | null;
  selectedNewsIds: string[];
  generatedImageUrl: string | null;
  isGenerating: boolean;
  statusText: string;
  newsItems: NewsItem[];
  isLoadingNews: boolean;
  setUploadedFile: (f: File | null) => void;
  toggleNews: (id: string) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

function rssToNewsItem(rssItem: RssItem): NewsItem {
  const category = categorizeNews(rssItem);
  const categoryColor = category === "ЖЕЛЕЗО" || category === "БЕЗОПАСНОСТЬ" ? "primary" : 
                        category === "ПО" || category === "ИНФРА" ? "secondary" : "default";
  
  const timeAgo = getTimeAgo(rssItem.pubDate);

  return {
    id: rssItem.id,
    category,
    categoryColor,
    time: timeAgo,
    title: rssItem.title,
    image: rssItem.image || "",
    imageAlt: rssItem.title,
  };
}

function getTimeAgo(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return "СЕЙЧАС";
    if (diff < 60) return `${diff} МИН НАЗАД`;
    if (diff < 1440) return `${Math.floor(diff / 60)} Ч НАЗАД`;
    return `${Math.floor(diff / 1440)} ДН НАЗАД`;
  } catch {
    return "";
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [uploadedFile, setUploadedFileRaw] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedNewsIds, setSelectedNewsIds] = useState<string[]>([]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const rssItems = await fetchLatestNews();
        const news = rssItems.map(rssToNewsItem);
        setNewsItems(news);
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setIsLoadingNews(false);
      }
    }
    loadNews();
  }, []);

  function setUploadedFile(f: File | null) {
    if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
    if (f) {
      setUploadedFileRaw(f);
      setUploadedPreview(URL.createObjectURL(f));
    } else {
      setUploadedFileRaw(null);
      setUploadedPreview(null);
    }
  }

  const toggleNews = useCallback((id: string) => {
    setSelectedNewsIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  async function generate() {
    if (!uploadedFile || selectedNewsIds.length === 0) return;

    const selectedItems = newsItems.filter((item) => selectedNewsIds.includes(item.id));
    if (selectedItems.length === 0) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
      setStatusText("Создаём промпт...");

      const { buildPrompt } = await import("../services/promptBuilder");
      const { generateImage } = await import("../services/imageGen");

      const prompt = buildPrompt("", selectedItems);

      setStatusText("Генерируем изображение...");
      const imageUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : undefined;
      const url = await generateImage(prompt, new AbortController().signal, 512, 512, imageUrl);

      if (!url) {
        throw new Error("Не удалось сгенерировать изображение");
      }

      setGeneratedImageUrl(url);
      setStatusText("Готово!");
    } catch (e) {
      setStatusText(`Ошибка: ${(e as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  function reset() {
    setUploadedFile(null);
    setSelectedNewsIds([]);
    setGeneratedImageUrl(null);
    setIsGenerating(false);
    setStatusText("");
  }

  return (
    <AppContext.Provider
      value={{
        uploadedFile,
        uploadedPreview,
        selectedNewsIds,
        generatedImageUrl,
        isGenerating,
        statusText,
        newsItems,
        isLoadingNews,
        setUploadedFile,
        toggleNews,
        generate,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}