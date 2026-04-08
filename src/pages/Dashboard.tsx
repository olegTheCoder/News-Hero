import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadZone from "../components/UploadZone";
import NewsCard from "../components/NewsCard";
import ActionButton from "../components/ActionButton";
import { newsItems } from "../data/news";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleGenerate() {
    navigate("/result");
  }

  return (
    <main className="h-[100dvh] flex flex-col overflow-y-auto">
      <div className="pt-8 md:pt-12 pb-32 md:pb-20 px-4 max-w-4xl mx-auto w-full flex flex-col gap-8 md:gap-12 flex-1">
        <UploadZone onFileSelect={() => {}} />

        <section className="flex flex-col gap-4">
          <h2 className="font-headline font-black text-lg md:text-xl text-secondary uppercase tracking-tighter leading-none flex items-center gap-2">
            <span className="material-symbols-outlined text-xl hidden md:inline">
              bolt
            </span>
            ТОП НОВОСТИ ДЛЯ ГЕНЕРАЦИИ
          </h2>

          <div className="flex flex-col gap-3 md:gap-4">
            {newsItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                isSelected={selectedIds.has(item.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
        </section>

        <div className="hidden md:flex justify-center w-full mt-4">
          <ActionButton variant="primary" icon="power_settings_new" onClick={handleGenerate}>
            НАЧАТЬ ГЕНЕРАЦИЮ
          </ActionButton>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background z-40 border-t-2 border-outline-variant md:hidden">
        <ActionButton variant="primary" icon="bolt" onClick={handleGenerate}>
          НАЧАТЬ ГЕНЕРАЦИЮ
        </ActionButton>
      </div>
    </main>
  );
}
