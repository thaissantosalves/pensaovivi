"use client";

import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type AdminFormHeaderProps = {
  title: string;
  backHref?: string;
};

export default function AdminFormHeader({
  title,
  backHref = "/admin",
}: AdminFormHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-stone-200 bg-[var(--surface)] px-4 py-3">
      <Link
        href={backHref}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
        aria-label="Voltar para meus pratos"
      >
        <ArrowBackIcon sx={{ fontSize: 20 }} />
      </Link>
      <h1 className="font-display text-lg text-orange-600 italic leading-tight">
        {title}
      </h1>
    </header>
  );
}
