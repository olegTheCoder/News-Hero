import type { NewsItem } from "../types";

interface NewsCardProps {
  item: NewsItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function NewsCard({ item, isSelected, onSelect }: NewsCardProps) {
  const categoryColors: Record<string, { border: string; tagBg: string; tagText: string; imgBg: string }> = {
    "ЖЕЛЕЗО": { border: "border-secondary", tagBg: "bg-secondary", tagText: "text-on-secondary", imgBg: "bg-secondary-container" },
    "БЕЗОПАСНОСТЬ": { border: "border-primary", tagBg: "bg-primary-container", tagText: "text-on-primary-fixed", imgBg: "bg-primary-container" },
    "ПО": { border: "border-secondary", tagBg: "bg-secondary", tagText: "text-on-secondary", imgBg: "bg-secondary-container" },
    "ИНФРА": { border: "border-secondary", tagBg: "bg-secondary", tagText: "text-on-secondary", imgBg: "bg-secondary-container" },
    "УПРАВЛЕНИЕ": { border: "border-outline-variant", tagBg: "bg-surface-variant", tagText: "text-on-surface-variant", imgBg: "bg-surface-variant" },
  };

  const colors = categoryColors[item.category] || categoryColors["УПРАВЛЕНИЕ"];
  const borderClass = isSelected ? colors.border : "border-outline-variant";

  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`
        relative w-full text-left
        flex items-center gap-4 md:gap-6 p-4 md:p-6
        border-2 bg-surface-container-low
        transition-all group cursor-pointer
        ${borderClass} hover:border-secondary
        ${isSelected ? "ring-2 ring-primary ring-opacity-50" : ""}
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
          <span
            className="material-symbols-outlined text-primary text-xl md:text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
      )}

      <div
        className={`w-16 h-16 md:w-24 md:h-24 shrink-0 border-2 border-on-background overflow-hidden ${colors.imgBg}`}
      >
        {item.image ? (
          <img
            alt={item.imageAlt}
            className="w-full h-full object-cover"
            src={item.image}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-outline">newspaper</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.5 font-label ${colors.tagBg} ${colors.tagText}`}
          >
            {item.category}
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">
            {item.time}
          </span>
        </div>
        <h3 className="font-headline font-bold text-[11px] md:text-lg leading-tight group-hover:text-primary transition-colors">
          {item.title}
        </h3>
      </div>

      <span className="material-symbols-outlined ml-auto text-outline group-hover:text-secondary hidden md:block">
        arrow_outward
      </span>
    </button>
  );
}