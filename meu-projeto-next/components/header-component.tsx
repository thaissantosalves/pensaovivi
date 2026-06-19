"use client";

import MenuIcon from "@mui/icons-material/Menu";

type HeaderComponentProps = {
  onMenuOpen: () => void;
};

export default function HeaderComponent({ onMenuOpen }: HeaderComponentProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--surface)] shadow-sm border-b border-[var(--border)]">
      <div className="max-w-md mx-auto px-4 py-3 grid grid-cols-[44px_1fr_44px] items-center gap-2">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Abrir menu"
          className="justify-self-start w-10 h-10 rounded-xl flex items-center justify-center text-orange-600 hover:bg-orange-50 active:scale-95 transition"
        >
          <MenuIcon sx={{ fontSize: 26 }} />
        </button>

        <h1 className="font-display text-[1.35rem] sm:text-2xl text-orange-600 text-center leading-tight italic tracking-tight">
          Pensão da Vivi
        </h1>

        <div className="w-10" aria-hidden />
      </div>
    </header>
  );
}
