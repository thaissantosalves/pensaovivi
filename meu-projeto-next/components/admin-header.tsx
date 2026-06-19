"use client";

import Link from "next/link";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  onLogout: () => void;
};

export default function AdminHeader({
  title,
  subtitle,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-[var(--surface)] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-xl text-orange-600 italic leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex shrink-0 items-center gap-1 px-2 py-1 text-xs font-semibold text-[var(--text-muted)] hover:text-red-600"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
          Sair
        </button>
      </div>
    </header>
  );
}
