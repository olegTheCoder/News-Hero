import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import UploadZone from "../components/UploadZone";
import NewsCard from "../components/NewsCard";
import ActionButton from "../components/ActionButton";
import { newsItems } from "../data/news";

export default function Dashboard() {
  const navigate = useNavigate();
  const { uploadedFile, selectedNews, toggleNews } = useApp();

  const canGenerate = !!uploadedFile && selectedNews.length > 0;

  function handleGenerate() {
    if (canGenerate) navigate("/result");
  }

  return (
    <main className="h-[100dvh] flex flex-col overflow-y-auto">
      <div className="pt-8 md:pt-12 pb-32 md:pb-20 px-4 max-w-4xl mx-auto w-full flex flex-col gap-8 md:gap-12 flex-1">
        <UploadZone />

        <section className="flex flex-col gap-4">
          <h2 className="font-headline font-black text-lg md:text-xl text-secondary uppercase tracking-tighter leading-none flex items-center gap-2">
            <span className="material-symbols-outlined text-xl hidden md:inline">
              bolt
            </span>
            ТОП НОВОСТИ ДЛЯ ГЕНЕРАЦИИ
          </h2>

          <p className="font-body text-on-surface-variant text-xs md:text-sm">
            Выберите новости — они определят сюжет для вашего героя
          </p>

          <div className="flex flex-col gap-3 md:gap-4">
            {newsItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                isSelected={selectedNews.some((n) => n.id === item.id)}
                onToggle={toggleNews}
              />
            ))}
          </div>
        </section>

        <div className="hidden md:flex justify-center w-full mt-4">
          <ActionButton
            variant="primary"
            icon="power_settings_new"
            fullWidth={false}
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            НАЧАТЬ ГЕНЕРАЦИЮ
          </ActionButton>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background z-40 border-t-2 border-outline-variant md:hidden">
        <ActionButton
          variant="primary"
          icon="bolt"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          НАЧАТЬ ГЕНЕРАЦИЮ
        </ActionButton>
      </div>
    </main>
  );
}
