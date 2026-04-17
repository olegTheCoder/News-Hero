import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { NewsItem } from "../types";
import { fetchLatestNews, categorizeNews, type RssItem } from "../services/newsFetcher";

interface AppState {
  selectedNewsIds: string[];
  generatedImageUrl: string | null;
  isGenerating: boolean;
  statusText: string;
  newsItems: NewsItem[];
  isLoadingNews: boolean;
  uploadedFile: File | null;
  uploadedPreview: string | null;
  setUploadedFile: (file: File | null) => void;
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
    description: rssItem.description,
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
  const [selectedNewsIds, setSelectedNewsIds] = useState<string[]>([]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [uploadedFile, setUploadedFileState] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const setUploadedFile = useCallback((file: File | null) => {
    setUploadedFileState(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedPreview(null);
    }
  }, []);

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
    if (selectedNewsIds.length === 0) return;

    const selectedItems = newsItems.filter((item) => selectedNewsIds.includes(item.id));

    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
      setStatusText("Создаём промпт...");

      const { buildPrompt } = await import("../services/promptBuilder");
      const { generateImage } = await import("../services/imageGen");

      const prompt = await buildPrompt(selectedItems);

      setStatusText("Генерируем изображение...");
      const result = await generateImage(prompt, new AbortController().signal);

      if (!result?.imageUrl) {
        throw new Error("Не удалось сгенерировать изображение");
      }

      setGeneratedImageUrl(result.imageUrl);
      setStatusText(`Готово! (модель: ${result.model})`);
    } catch (e) {
      setStatusText(`Ошибка: ${(e as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  function reset() {
    setSelectedNewsIds([]);
    setGeneratedImageUrl(null);
    setIsGenerating(false);
    setStatusText("");
    setUploadedFileState(null);
    setUploadedPreview(null);
  }

  return (
    <AppContext.Provider
      value={{
        selectedNewsIds,
        generatedImageUrl,
        isGenerating,
        statusText,
        newsItems,
        isLoadingNews,
        uploadedFile,
        uploadedPreview,
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