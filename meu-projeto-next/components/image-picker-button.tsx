"use client";

import { IMAGE_ACCEPT } from "@/lib/image-file";

type ImagePickerButtonProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

/**
 * Input nativo estilizado — abre galeria/câmera no iOS e Android
 * (label + opacity-0 falha em alguns Safari mobile).
 */
export default function ImagePickerButton({
  onChange,
  label = "Escolher da galeria",
}: ImagePickerButtonProps) {
  return (
    <input
      type="file"
      accept={IMAGE_ACCEPT}
      onChange={onChange}
      aria-label={label}
      className="w-full min-h-[44px] cursor-pointer rounded-lg border border-stone-200 bg-white py-2 pl-3 text-sm text-stone-500 file:me-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-700"
      style={{ fontSize: 16 }}
    />
  );
}
