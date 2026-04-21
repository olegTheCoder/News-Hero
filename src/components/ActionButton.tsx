import type { ReactNode } from "react";

type IconName = string;

interface ActionButtonProps {
  variant: "primary" | "secondary";
  children: ReactNode;
  icon?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  primary:
    "bg-primary-container text-on-primary-fixed border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#9d8fff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  secondary:
    "bg-secondary text-on-secondary border-4 border-on-background shadow-[6px_6px_0px_0px_#9d8fff] hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
};

export default function ActionButton({
  variant,
  children,
  icon,
  fullWidth = true,
  disabled = false,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-headline font-black text-base md:text-2xl uppercase tracking-tighter
        py-3 px-5 md:py-8 md:px-12
        transition-all
        flex items-center justify-center gap-2 md:gap-4
        ${fullWidth ? "w-full" : "min-w-[200px] md:min-w-[320px]"}
        ${disabled ? "opacity-30 cursor-not-allowed grayscale" : "cursor-pointer"}
        ${!disabled ? variantClasses[variant] : variantClasses[variant]}
      `}
    >
      {children}
      {icon && (
        <span
          className="material-symbols-outlined text-xl md:text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      )}
    </button>
  );
}
