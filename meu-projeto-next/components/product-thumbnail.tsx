import Image from "next/image";
import AppIcon from "@/components/app-icon";
import type { AppIconName } from "@/types/icons";

type ProductThumbnailProps = {
  imageUrl?: string | null;
  icon: AppIconName;
  alt: string;
  size?: "sm" | "md" | "lg";
  dimmed?: boolean;
};

const sizes = {
  sm: { box: "w-11 h-11", icon: 22, image: 44 },
  md: { box: "w-[72px] h-[72px]", icon: 32, image: 72 },
  lg: { box: "w-20 h-20", icon: 48, image: 80 },
};

export default function ProductThumbnail({
  imageUrl,
  icon,
  alt,
  size = "md",
  dimmed = false,
}: ProductThumbnailProps) {
  const s = sizes[size];
  const baseClass = `${s.box} rounded-full shrink-0 overflow-hidden flex items-center justify-center border-2 border-[var(--surface)] shadow-md`;

  if (imageUrl) {
    return (
      <div className={`${baseClass} ${dimmed ? "opacity-70" : ""}`}>
        <Image
          src={imageUrl}
          alt={alt}
          width={s.image}
          height={s.image}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} bg-gradient-to-br from-amber-100 to-orange-100 ${
        dimmed ? "from-stone-200 to-stone-300" : ""
      }`}
    >
      <AppIcon
        name={icon}
        size={s.icon}
        color={dimmed ? "#78716c" : "#ea580c"}
      />
    </div>
  );
}
