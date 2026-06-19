"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AppIcon from "@/components/app-icon";
import ProductThumbnail from "@/components/product-thumbnail";
import { categories } from "@/lib/menu-data";
import { formatPrice } from "@/lib/format";
import ModalCloseButton from "@/components/modal-close-button";
import { fieldInputSurfaceClass } from "@/lib/input-styles";
import { formatMoneyInput, maskMoneyInput, parseMoneyInput } from "@/lib/masks";
import { IMAGE_ACCEPT, validateImageFile } from "@/lib/image-file";
import type { CategoryId, Product } from "@/types";

type ProductForm = {
  categoryId: CategoryId;
  name: string;
  description: string;
  price: string;
  active: boolean;
};

const emptyForm = (categoryId: CategoryId = "refeicoes"): ProductForm => ({
  categoryId,
  name: "",
  description: "",
  price: "",
  active: true,
});

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("refeicoes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const filteredProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory]
  );

  const visibleCount = filteredProducts.filter((p) => p.active !== false).length;

  const resetImageState = () => {
    setImagePreview(null);
    setImageFile(null);
    setRemoveImage(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm(activeCategory));
    setError("");
    resetImageState();
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: formatMoneyInput(product.price),
      active: product.active !== false,
    });
    setError("");
    resetImageState();
    setImagePreview(product.imageUrl ?? null);
    setModalOpen(true);
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    try {
      validateImageFile(file);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível usar esta imagem."
      );
      return;
    }

    setError("");
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const uploadImageForProduct = async (productId: string) => {
    if (removeImage) {
      const res = await fetch(
        `/api/products/upload?productId=${encodeURIComponent(productId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao remover imagem.");
      }
      return;
    }

    if (!imageFile) return;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("productId", productId);

    const res = await fetch("/api/products/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Erro ao enviar imagem.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      categoryId: form.categoryId,
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseMoneyInput(form.price),
      active: form.active,
    };

    if (!payload.name) {
      setError("Digite o nome do prato.");
      setSaving(false);
      return;
    }
    if (!payload.price || payload.price <= 0 || !Number.isFinite(payload.price)) {
      setError("Digite um preço válido.");
      setSaving(false);
      return;
    }

    try {
      const res = editingId
        ? await fetch(`/api/products/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar.");
        return;
      }

      const productId = editingId ?? data.product?.id;
      if (productId && (imageFile || removeImage)) {
        await uploadImageForProduct(productId);
      }

      setModalOpen(false);
      resetImageState();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sem conexão. Tente de novo."
      );
    } finally {
      setSaving(false);
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
    <div className="min-h-dvh bg-[var(--bg)] overflow-x-hidden">
      <div className="max-w-md mx-auto min-h-dvh bg-[var(--bg)] shadow-xl shadow-stone-200/30 overflow-x-hidden">
        <header className="sticky top-0 z-10 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-xl text-orange-600 italic leading-tight">
                Meus pratos
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                Esconda pratos que não estão disponíveis hoje. Eles ficam
                salvos e você pode mostrar de novo quando quiser.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-red-600 px-2 py-1"
            >
              <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
              Sair
            </button>
          </div>
        </header>

        <main className="px-4 py-5 pb-28">
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
                return (
                  <article
                    key={product.id}
                    className={`rounded-2xl border p-4 transition ${
                      isVisible
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
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text)] hover:border-orange-300 hover:bg-orange-50/50 transition"
                      >
                        <EditOutlinedIcon sx={{ fontSize: 15 }} />
                        Editar
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        <div className="fixed bottom-0 inset-x-0 z-20 px-4 pb-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              type="button"
              onClick={openCreate}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-orange-200/50 hover:bg-orange-600 active:scale-[0.99] transition"
            >
              <AddIcon sx={{ fontSize: 22 }} />
              Adicionar prato
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-[var(--surface)] rounded-t-3xl p-5 pt-4 space-y-4 max-h-[90dvh] sheet-scroll"
          >
            <div className="flex items-start justify-between gap-3 sticky top-0 bg-[var(--surface)] pb-1 z-10">
              <h3 className="text-lg font-bold text-[var(--text)]">
                {editingId ? "Editar prato" : "Novo prato"}
              </h3>
              <ModalCloseButton onClick={() => setModalOpen(false)} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--text)] mb-2">
                Tipo de prato
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, categoryId: cat.id }))
                    }
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm font-semibold transition ${
                      form.categoryId === cat.id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-[var(--border)] text-[var(--text-muted)]"
                    }`}
                  >
                    <AppIcon
                      name={cat.icon}
                      size={18}
                      color={
                        form.categoryId === cat.id ? "#c2410c" : "#78716c"
                      }
                    />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Field
              label="Foto do prato"
              hint="Galeria ou câmera · JPG, PNG, HEIC · até 5 MB (opcional)"
            >
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Prévia"
                    className="w-20 h-20 rounded-2xl object-cover border border-[var(--border)]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-dashed border-orange-200 flex items-center justify-center">
                    <AppIcon name="restaurant" size={28} color="#ea580c" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    onClick={openImagePicker}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition w-full sm:w-auto"
                  >
                    Escolher da galeria
                  </button>
                  {(imagePreview || editingId) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="block text-xs font-semibold text-red-600 hover:underline"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </Field>

            <Field label="Nome do prato" hint="Ex: Prato feito, Strogonoff...">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Como aparece no cardápio"
                className={inputClass}
              />
            </Field>

            <Field
              label="O que vem no prato?"
              hint="Ingredientes ou acompanhamentos"
            >
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                placeholder="Ex: arroz, feijão, bife e salada"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Preço (R$)">
              <input
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: maskMoneyInput(e.target.value) })
                }
                required
                placeholder="Ex: 24,90"
                className={inputClass}
              />
            </Field>

            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div>
                <p className="text-sm font-bold text-[var(--text)]">
                  Aparece no cardápio?
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {form.active
                    ? "Clientes podem ver e pedir"
                    : "Fica escondido por enquanto"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className={`w-12 h-7 rounded-full relative transition shrink-0 ${
                  form.active ? "bg-green-500" : "bg-stone-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition ${
                    form.active ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1 pb-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl border border-[var(--border)] font-semibold text-sm text-[var(--text-muted)]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar prato"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const inputClass = fieldInputSurfaceClass;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--text)] mb-0.5">
        {label}
      </label>
      {hint && (
        <p className="text-[11px] text-[var(--text-muted)] mb-1.5">{hint}</p>
      )}
      {children}
    </div>
  );
}
