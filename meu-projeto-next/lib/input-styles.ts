/** Classe compartilhada para campos de formulário — text-base (16px) evita zoom no iOS */
export const fieldInputClass =
  "w-full rounded-lg border px-3 py-3 text-base focus:outline-none max-w-full";

export const fieldInputSurfaceClass = `${fieldInputClass} border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-stone-400 focus:ring-2 focus:ring-orange-400`;

export const fieldInputLightClass = `${fieldInputClass} border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-400`;

/** Campos do admin — branco clean com borda suave */
export const adminFieldInputClass = `${fieldInputClass} border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-400/20 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100`;
