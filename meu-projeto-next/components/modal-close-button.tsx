import AppIcon from "@/components/app-icon";

type ModalCloseButtonProps = {
  onClick: () => void;
  className?: string;
  variant?: "light" | "dark";
};

export default function ModalCloseButton({
  onClick,
  className = "",
  variant = "light",
}: ModalCloseButtonProps) {
  const base =
    variant === "light"
      ? "bg-white/95 text-stone-600 hover:bg-white shadow-md border border-stone-200/80"
      : "bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fechar"
      className={`flex items-center justify-center w-9 h-9 rounded-full transition shrink-0 ${base} ${className}`}
    >
      <AppIcon name="close" size={20} color={variant === "light" ? "#57534e" : "#ffffff"} />
    </button>
  );
}
