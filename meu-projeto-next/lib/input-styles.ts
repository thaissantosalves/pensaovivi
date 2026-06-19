/** Classe compartilhada para campos de formulário — text-base (16px) evita zoom no iOS */
export const fieldInputClass =
  "w-full rounded-xl border px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 max-w-full";

export const fieldInputSurfaceClass = `${fieldInputClass} border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-stone-400`;

export const fieldInputLightClass = `${fieldInputClass} border-stone-200 bg-white text-stone-800 placeholder:text-stone-400`;
