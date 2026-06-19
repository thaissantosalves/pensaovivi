"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AppIcon from "@/components/app-icon";
import { useTheme } from "@/context/theme-context";
import { getWhatsAppUrl, STORE } from "@/lib/constants";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
};

export default function SideMenu({ open, onClose }: SideMenuProps) {
  const theme = useTheme();
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || address) return;

    setAddressLoading(true);
    fetch(`https://viacep.com.br/ws/${STORE.cep}/json/`)
      .then((res) => res.json())
      .then((data: ViaCepResponse) => {
        if (data.erro) {
          setAddress(`CEP ${STORE.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}`);
          return;
        }
        setAddress(
          `${data.logradouro}, ${data.bairro} — ${data.localidade}/${data.uf} · CEP ${data.cep}`
        );
      })
      .catch(() => {
        setAddress(`CEP ${STORE.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}`);
      })
      .finally(() => setAddressLoading(false));
  }, [open, address]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Fechar menu"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <nav className="absolute left-0 top-0 h-full w-[min(100%,320px)] bg-[var(--surface)] shadow-2xl flex flex-col animate-slide-left border-r border-[var(--border)]">
        <div className="px-5 py-5 border-b border-[var(--border)] pr-14 shrink-0">
          <p className="font-display text-xl text-orange-600 italic">
            Pensão da Vivi
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Menu</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-4">
          <button
            type="button"
            onClick={theme.toggleDarkMode}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] hover:border-orange-200 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                {theme.darkMode ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 22 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 22 }} />
                )}
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--text)]">
                  {theme.darkMode ? "Modo claro" : "Modo escuro"}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Toque para alternar
                </p>
              </div>
            </div>
            <span
              className={`w-11 h-6 rounded-full relative transition ${
                theme.darkMode ? "bg-orange-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
                  theme.darkMode ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          <InfoCard
            icon={<ScheduleIcon sx={{ fontSize: 22 }} />}
            title="Horário de funcionamento"
          >
            <p className="text-sm font-bold text-[var(--text)]">
              {STORE.openHours}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {STORE.openHoursDetail}
            </p>
          </InfoCard>

          <InfoCard
            icon={<PlaceOutlinedIcon sx={{ fontSize: 22 }} />}
            title="Endereço"
          >
            {addressLoading ? (
              <p className="text-xs text-[var(--text-muted)]">
                Buscando endereço...
              </p>
            ) : (
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {address}
              </p>
            )}
          </InfoCard>

          <InfoCard
            icon={<PhoneOutlinedIcon sx={{ fontSize: 22 }} />}
            title="Contato"
          >
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              {STORE.whatsappDisplay}
            </a>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              WhatsApp · mesmo número para pedidos
            </p>
          </InfoCard>
        </div>

        <div className="shrink-0 px-4 py-4 pb-5 border-t border-[var(--border)]">
          <Link
            href="/admin/login"
            onClick={onClose}
            className="flex items-center gap-3 w-full p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-orange-300 hover:bg-orange-50/40 active:scale-[0.99] transition shadow-sm group"
          >
            <span className="w-9 h-9 rounded-xl border border-[var(--border)] bg-white flex items-center justify-center shrink-0 group-hover:border-orange-200 transition">
              <AdminPanelSettingsOutlinedIcon
                sx={{ fontSize: 18, color: "#78716c" }}
              />
            </span>
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-sm font-semibold text-[var(--text)] group-hover:text-orange-700 transition">
                Sou Pensão da Vivi
              </span>
              <span className="block text-[11px] text-[var(--text-muted)]">
                Acesso administrativo
              </span>
            </span>
            <ChevronRightIcon
              sx={{
                fontSize: 20,
                color: "#a8a29e",
              }}
              className="shrink-0 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[var(--surface-muted)] flex items-center justify-center"
          aria-label="Fechar"
        >
          <AppIcon name="close" size={20} color="#78716c" />
        </button>
      </nav>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
            {title}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
