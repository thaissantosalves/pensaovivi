"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AdminHeader from "@/components/admin-header";
import AppIcon from "@/components/app-icon";
import ProductThumbnail from "@/components/product-thumbnail";
import { categories } from "@/lib/menu-data";
import { formatPrice } from "@/lib/format";
import type { CategoryId, Product } from "@/types";
import { adminBtnBlock, adminBtnPrimary } from "@/lib/admin-button-styles";

const validCategories = new Set(categories.map((c) => c.id));

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("refeicoes");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [meRes, productsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/products?all=true"),
      ]);

      if (!meRes.ok) {
        router.push("/admin/login");
        return;
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const raw = sessionStorage.getItem("adminFlash");
    if (!raw) return;

    sessionStorage.removeItem("adminFlash");

    try {
      const flash = JSON.parse(raw) as {
        id?: string;
        cat?: string;
        nome?: string;
        type?: "created" | "updated";
      };

      if (flash.cat && validCategories.has(flash.cat as CategoryId)) {
        setActiveCategory(flash.cat as CategoryId);
      }

      const label = flash.nome ?? "Prato";
      setSuccessMessage(
        flash.type === "updated"
          ? `"${label}" atualizado com sucesso!`
          : `"${label}" cadastrado com sucesso!`
      );

      if (flash.id) setHighlightId(flash.id);

      const timer = window.setTimeout(() => {
        setSuccessMessage(null);
        setHighlightId(null);
      }, 6000);

      return () => window.clearTimeout(timer);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!highlightId || products.length === 0) return;

    const el = document.getElementById(`admin-product-${highlightId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId, products]);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory]
  );

  const visibleCount = filteredProducts.filter((p) => p.active !== false).length;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const toggleVisibility = async (product: Product) => {
    setToggleError("");
    setTogglingId(product.id);
    const nextActive = product.active === false;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });

      if (!res.ok) {
        const data = await res.json();
        setToggleError(data.error ?? "Não foi possível atualizar o prato.");
        return;
      }

      await loadData();
    } catch {
      setToggleError("Sem conexão. Tente de novo.");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)] text-sm">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-md bg-[var(--bg)] shadow-xl shadow-stone-200/30">
        <AdminHeader
          title="Meus pratos"
          subtitle="Esconda pratos indisponíveis hoje. Eles ficam salvos e você pode mostrar de novo quando quiser."
          onLogout={handleLogout}
        />

        <main className="px-4 py-5 pb-28">
          {successMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">
              <CheckCircleOutlineIcon sx={{ fontSize: 18, mt: "2px", flexShrink: 0 }} />
              <p>{successMessage}</p>
            </div>
          )}
          <div className="mb-4">
            <p className="text-sm font-bold text-[var(--text)] mb-2">
              Tipo de prato
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap text-sm font-semibold transition shrink-0 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]"
                    }`}
                  >
                    <AppIcon
                      name={cat.icon}
                      size={18}
                      color={isActive ? "#fff" : "#ea580c"}
                    />
                    {cat.name}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/25" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[var(--text-muted)]">
              {visibleCount} visível{visibleCount !== 1 ? "is" : ""} ·{" "}
              {filteredProducts.length - visibleCount} escondido
              {filteredProducts.length - visibleCount !== 1 ? "s" : ""}
            </p>
            <Link
              href="/"
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              Ver cardápio
            </Link>
          </div>

          {toggleError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">
              {toggleError}
            </p>
          )}

          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
                <p className="text-sm font-semibold text-[var(--text)]">
                  Nenhum prato nesta categoria
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Toque no botão abaixo para adicionar
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const isVisible = product.active !== false;
                const isHighlighted = highlightId === product.id;
                return (
                  <article
                    key={product.id}
                    id={`admin-product-${product.id}`}
                    className={`rounded-2xl border p-4 transition ${
                      isHighlighted
                        ? "border-green-400 bg-green-50/60 ring-2 ring-green-400/40"
                        : isVisible
                          ? "bg-[var(--surface)] border-[var(--border)]"
                          : "bg-stone-50 border-stone-200 opacity-80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <ProductThumbnail
                        imageUrl={product.imageUrl}
                        icon={product.icon}
                        alt={product.name}
                        size="sm"
                        dimmed={!isVisible}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`font-bold text-sm leading-tight ${
                              isVisible
                                ? "text-[var(--text)]"
                                : "text-stone-500 line-through decoration-stone-400"
                            }`}
                          >
                            {product.name}
                          </p>
                          <p className="text-sm font-extrabold text-orange-600 shrink-0">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border)]">
                      <button
                        type="button"
                        disabled={togglingId === product.id}
                        onClick={() => toggleVisibility(product)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
                          isVisible
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                            : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
                        }`}
                      >
                        {isVisible ? (
                          <>
                            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                            No cardápio
                          </>
                        ) : (
                          <>
                            <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                            Escondido
                          </>
                        )}
                      </button>
                      <Link
                        href={`/admin/editar/${product.id}`}
                        className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text)] hover:border-orange-300 hover:bg-orange-50/50 transition"
                      >
                        <EditOutlinedIcon sx={{ fontSize: 15 }} />
                        Editar
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        <div className="fixed bottom-0 inset-x-0 z-20 px-4 pb-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <Link
              href={`/admin/novo?categoria=${activeCategory}`}
              className={`${adminBtnPrimary} ${adminBtnBlock} gap-2`}
            >
              <AddIcon sx={{ fontSize: 20 }} />
              Cadastrar prato
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
