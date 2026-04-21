import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useApp } from "../context/AppContext";

export default function UploadZone() {
  const { uploadedPreview, setUploadedFile } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setUploadedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (uploadedPreview) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg md:text-xl text-primary flex items-center gap-2 uppercase tracking-tight">
            <span className="material-symbols-outlined text-xl">person</span>
            ГЛАВНЫЙ ГЕРОЙ
          </h2>
          <button
            onClick={handleClear}
            className="font-label text-error text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:text-error-dim transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            УДАЛИТЬ
          </button>
        </div>
        <div className="relative border-4 border-primary p-2 bg-surface-container-lowest shadow-[8px_8px_0px_0px_rgba(202,253,0,1)]">
          <img
            src={uploadedPreview}
            alt="Загруженное изображение — главный герой"
            className="w-full max-h-64 md:max-h-96 object-contain bg-surface-container-lowest"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-bold text-lg md:text-xl text-primary flex items-center gap-2 uppercase tracking-tight">
          <span className="material-symbols-outlined text-xl">
            upload_file
          </span>
          ЗАГРУЗИТЕ ГЕРОЯ
        </h2>
        <span className="font-label text-outline text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block">
          ПОДДЕРЖИВАЕТ JPG, PNG, WEBP
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          group relative cursor-pointer border-4 border-dashed border-secondary
          p-5 md:p-12 bg-surface-container-high
          transition-all hover:bg-surface-container-highest
          flex flex-col items-center justify-center gap-3 md:gap-6
          overflow-hidden
          ${isDragOver ? "bg-surface-container-highest border-primary" : ""}
        `}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#9d8fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 p-4 md:p-6 bg-secondary text-on-secondary border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <span
            className="material-symbols-outlined text-2xl md:text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add_photo_alternate
          </span>
        </div>

        <div className="relative z-10 text-center">
          <p className="font-headline font-black text-lg md:text-2xl text-on-background uppercase tracking-tight">
            ПЕРЕТАЩИТЕ ИЗОБРАЖЕНИЕ СЮДА
          </p>
          <p className="font-body text-on-surface-variant mt-2 text-xs md:text-sm font-medium">
            Этот персонаж станет главным героем в новостном сюжете
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </section>
  );
}