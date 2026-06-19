/** Botões do admin — flat, sem sombra, cantos suaves */
export const adminBtnBase =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

export const adminBtnPrimary = `${adminBtnBase} bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800`;

export const adminBtnSecondary = `${adminBtnBase} border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 active:bg-stone-100`;

export const adminBtnGhost = `${adminBtnBase} text-stone-600 hover:bg-stone-50 active:bg-stone-100`;

export const adminBtnBlock = "flex w-full min-h-[44px] px-4 py-2.5";

export const adminBtnChip = `${adminBtnBase} gap-2 border px-3 py-2 text-left text-sm`;

export const adminBtnChipActive =
  "border-orange-600 bg-orange-50 text-orange-800";

export const adminBtnChipIdle =
  "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50";
