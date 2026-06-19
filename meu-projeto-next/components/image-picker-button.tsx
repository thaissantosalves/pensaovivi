"use client";

import { IMAGE_ACCEPT } from "@/lib/image-file";

type ImagePickerButtonProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function ImagePickerButton({
  onChange,
  label = "Escolher da galeria",
}: ImagePickerButtonProps) {
  return (
    <label className="relative flex w-full min-h-[44px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold text-white hover:bg-orange-600 transition active:scale-[0.98]">
      <span className="pointer-events-none select-none">{label}</span>
      <input
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={onChange}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        style={{ fontSize: 16 }}
        aria-label={label}
      />
    </label>
  );
}
