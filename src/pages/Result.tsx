import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ActionButton from "../components/ActionButton";

export default function Result() {
  const navigate = useNavigate();
  const { generatedImageUrl, isGenerating, statusText, reset } = useApp();

  function handleRegenerate() {
    reset();
    navigate("/");
  }

  function handleDownload() {
    if (!generatedImageUrl) return;
    const a = document.createElement("a");
    a.href = generatedImageUrl;
    a.download = `news-hero-${Date.now()}.png`;
    a.click();
  }

  if (isGenerating) {
    return (
      <main className="h-[100dvh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-on-background" />
            <div className="absolute inset-0 animate-square-spin">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary" />
              <div className="absolute top-0 left-6 right-6 h-[4px] bg-primary" />
              <div className="absolute bottom-0 left-6 right-6 h-[4px] bg-primary" />
              <div className="absolute left-0 top-6 bottom-6 w-[4px] bg-primary" />
              <div className="absolute right-0 top-6 bottom-6 w-[4px] bg-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-headline font-black text-2xl text-primary uppercase tracking-tight">
              {statusText || "ГЕНЕРАЦИЯ..."}
            </p>
            <p className="font-body text-on-surface-variant mt-2 text-sm">
              Создаём карикатуру по новостям
            </p>
          </div>

          <div className="w-full max-w-lg border-4 border-primary p-2 bg-surface-container-lowest shadow-[8px_8px_0px_0px_rgba(202,253,0,1)]">
            <div className="w-full aspect-square bg-surface-container-highest animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!generatedImageUrl) {
    return (
      <main className="h-[100dvh] flex items-center justify-center p-6">
        <div className="text-center flex flex-col gap-6">
          <span className="material-symbols-outlined text-6xl text-error">
            error
          </span>
          <p className="font-headline font-bold text-xl text-error uppercase">
            {statusText || "ОШИБКА ГЕНЕРАЦИИ"}
          </p>
          <ActionButton variant="secondary" icon="arrow_back" onClick={handleRegenerate}>
            НАЗАД
          </ActionButton>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full py-8 md:py-12 flex flex-col gap-8 items-center">
        <div className="w-full max-w-lg relative">
          <div className="border-4 border-primary p-2 bg-surface-container-lowest shadow-[8px_8px_0px_0px_rgba(202,253,0,1)]">
            <img
              alt="Сгенерированное новостное изображение с вашим героем"
              className="w-full h-auto max-h-[60vh] object-contain border-2 border-primary-dim"
              src={generatedImageUrl}
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ActionButton variant="primary" icon="download" onClick={handleDownload}>
            СКАЧАТЬ
          </ActionButton>
          <ActionButton variant="secondary" icon="refresh" onClick={handleRegenerate}>
            СГЕНЕРИРОВАТЬ СНОВА
          </ActionButton>
        </div>
      </div>
    </main>
  );
}