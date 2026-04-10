import type { NewsItem } from "../types";

interface NewsCardProps {
  item: NewsItem;
  isSelected: boolean;
  onToggle: (item: NewsItem) => void;
}

const borderColors: Record<string, string> = {
  secondary: "border-secondary",
  primary: "border-primary",
  default: "border-outline-variant",
};

const tagColors: Record<string, { bg: string; text: string }> = {
  secondary: { bg: "bg-secondary-container", text: "text-secondary" },
  primary: { bg: "bg-on-primary-fixed-variant", text: "text-primary" },
  default: { bg: "bg-surface-variant", text: "text-on-surface-variant" },
};

const imageBgColors: Record<string, string> = {
  secondary: "bg-secondary-container",
  primary: "bg-primary-container",
  default: "bg-surface-variant",
};

export default function NewsCard({ item, isSelected, onToggle }: NewsCardProps) {
  const colorKey = item.categoryColor;
  const border = isSelected ? borderColors[colorKey] : "border-outline-variant";
  const tag = tagColors[colorKey];
  const imgBg = imageBgColors[colorKey];

  return (
    <div
      onClick={() => onToggle(item)}
      className={`
        flex items-center gap-4 md:gap-6 p-4 md:p-6
        border-2 bg-surface-container-low
        hover:border-secondary transition-colors group cursor-pointer
        relative
        ${border}
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3">
          <span
            className="material-symbols-outlined text-primary text-xl md:text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
      )}

      <div
        className={`w-16 h-16 md:w-24 md:h-24 shrink-0 border-2 border-on-background overflow-hidden ${imgBg}`}
      >
        <img
          alt={item.imageAlt}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all ${
            colorKey === "default" ? "grayscale group-hover:grayscale-0" : ""
          }`}
          src={item.image}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.5 font-label ${tag.bg} ${tag.text}`}
          >
            {item.category}
          </span>
          <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">
            {item.time}
          </span>
        </div>
        <h3 className="font-headline font-bold text-[11px] md:text-lg leading-tight group-hover:text-primary transition-colors uppercase md:normal-case">
          {item.title}
        </h3>
      </div>

      <span className="material-symbols-outlined ml-auto text-outline group-hover:text-secondary hidden md:block">
        arrow_outward
      </span>
    </div>
  );
}
