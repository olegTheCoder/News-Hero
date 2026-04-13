import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NewsCard from "../components/NewsCard";
import ActionButton from "../components/ActionButton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedNewsIds, toggleNews, newsItems, isLoadingNews, generate } = useApp();

  const canGenerate = selectedNewsIds.length > 0;

  async function handleGenerate() {
    if (canGenerate) {
      navigate("/result");
      await generate();
    }
  }

  if (isLoadingNews) {
    return (
      <main className="h-[100dvh] flex flex-col overflow-y-auto">
        <div className="pt-8 md:pt-12 pb-32 md:pb-20 px-4 max-w-4xl mx-auto w-full flex flex-col gap-8 md:gap-12 flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary animate-pulse" />
            <p className="font-headline font-bold text-primary uppercase tracking-tight">
              Загружаем новости...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] flex flex-col overflow-y-auto">
      <div className="pt-8 md:pt-12 pb-32 md:pb-20 px-4 max-w-4xl mx-auto w-full flex flex-col gap-8 md:gap-12 flex-1">
        <section className="flex flex-col gap-4">
          <h2 className="font-headline font-black text-lg md:text-xl text-secondary uppercase tracking-tighter leading-none flex items-center gap-2">
            <span className="material-symbols-outlined text-xl hidden md:inline">
              bolt
            </span>
            ВЫБЕРИТЕ НОВОСТИ
          </h2>

          <p className="font-body text-on-surface-variant text-xs md:text-sm">
            Выберите новости (одну или несколько) — они станут сюжетом для карикатуры
          </p>

          {newsItems.length === 0 ? (
            <p className="font-body text-on-surface-variant text-sm py-8 text-center">
              Не удалось загрузить новости. Проверьте подключение к интернету.
            </p>
          ) : (
            <div className="flex flex-col gap-3 md:gap-4">
              {newsItems.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  isSelected={selectedNewsIds.includes(item.id)}
                  onSelect={toggleNews}
                />
              ))}
            </div>
          )}
        </section>

        {selectedNewsIds.length > 0 && (
          <div className="hidden md:block text-sm text-on-surface-variant">
            Выбрано новостей: {selectedNewsIds.length}
          </div>
        )}

        <div className="hidden md:flex justify-center w-full mt-4">
          <ActionButton
            variant="primary"
            icon="power_settings_new"
            fullWidth={false}
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            СОЗДАТЬ КАРИКАТУРУ
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
          СОЗДАТЬ КАРИКАТУРУ
        </ActionButton>
      </div>
    </main>
  );
}
