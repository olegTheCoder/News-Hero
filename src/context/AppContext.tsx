import { createContext, useContext, useState, useRef, type ReactNode } from "react";
import type { NewsItem } from "../types";

interface AppState {
  uploadedFile: File | null;
  uploadedPreview: string | null;
  selectedNews: NewsItem[];
  generatedImageUrl: string | null;
  isGenerating: boolean;
  statusText: string;
  setUploadedFile: (f: File | null) => void;
  toggleNews: (item: NewsItem) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [uploadedFile, setUploadedFileRaw] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");

  const abortRef = useRef<AbortController | null>(null);

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

  function toggleNews(item: NewsItem) {
    setSelectedNews((prev) => {
      const exists = prev.find((n) => n.id === item.id);
      return exists ? prev.filter((n) => n.id !== item.id) : [...prev, item];
    });
  }

  async function generate() {
    if (!uploadedFile || selectedNews.length === 0) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    abortRef.current = new AbortController();

    try {
      setStatusText("Анализируем изображение...");

      const { describeImage } = await import("../services/hfVision");
      const { buildPrompt } = await import("../services/promptBuilder");
      const { generateImage } = await import("../services/imageGen");

      let imageDescription = "";
      try {
        imageDescription = await describeImage(uploadedFile);
      } catch {
        imageDescription = "";
      }

      setStatusText("Создаём промпт...");
      const prompt = buildPrompt(imageDescription, selectedNews);

      setStatusText("Генерируем изображение...");
      const url = await generateImage(prompt, abortRef.current.signal);

      setGeneratedImageUrl(url);
      setStatusText("Готово!");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setStatusText(`Ошибка: ${(e as Error).message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setUploadedFile(null);
    setSelectedNews([]);
    setGeneratedImageUrl(null);
    setIsGenerating(false);
    setStatusText("");
  }

  return (
    <AppContext.Provider
      value={{
        uploadedFile,
        uploadedPreview,
        selectedNews,
        generatedImageUrl,
        isGenerating,
        statusText,
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
