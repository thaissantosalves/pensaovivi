"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "E-mail ou senha incorretos.");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Sem conexão. Tente de novo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-orange-600 italic">
            Pensão da Vivi
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Entrar para gerenciar os pratos
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputClass}
              placeholder="Sua senha"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-[11px] text-center text-[var(--text-muted)] leading-relaxed">
            Demo: admin@pensaovivi.com · senha vivi2024
          </p>
        </form>

        <Link
          href="/"
          className="block text-center text-sm text-[var(--text-muted)] hover:text-orange-600 mt-6"
        >
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-400";
