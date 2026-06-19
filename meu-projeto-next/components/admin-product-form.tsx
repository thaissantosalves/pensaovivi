"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppIcon from "@/components/app-icon";
import AdminFormHeader from "@/components/admin-form-header";
import ImagePickerButton from "@/components/image-picker-button";
import { AdminField } from "@/components/admin-field";
import { categories } from "@/lib/menu-data";
import { adminFieldInputClass } from "@/lib/input-styles";
import {
  adminBtnChip,
  adminBtnChipActive,
  adminBtnChipIdle,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/lib/admin-button-styles";
import { formatMoneyInput, maskMoneyInput, parseMoneyInput } from "@/lib/masks";
import { validateImageFile } from "@/lib/image-file";
import type { CategoryId, Product } from "@/types";

type ProductForm = {
  categoryId: CategoryId;
  name: string;
  description: string;
  price: string;
  active: boolean;
};

type AdminProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialCategory?: CategoryId;
};

const emptyForm = (categoryId: CategoryId = "refeicoes"): ProductForm => ({
  categoryId,
  name: "",
  description: "",
  price: "",
  active: true,
});

export default function AdminProductForm({
  mode,
  productId,
  initialCategory = "refeicoes",
}: AdminProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [form, setForm] = useState<ProductForm>(emptyForm(initialCategory));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;

    let cancelled = false;

    async function loadProduct() {
      try {
        const [meRes, productsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/products?all=true"),
        ]);

        if (!meRes.ok) {
          router.push("/admin/login");
          return;
        }

        if (!productsRes.ok) {
          setError("Não foi possível carregar o prato.");
          return;
        }

        const data = await productsRes.json();
        const product = (data.products as Product[] | undefined)?.find(
          (p) => p.id === productId
        );

        if (cancelled) return;

        if (!product) {
          setError("Prato não encontrado.");
          return;
        }

        setForm({
          categoryId: product.categoryId,
          name: product.name,
          description: product.description,
          price: formatMoneyInput(product.price),
          active: product.active !== false,
        });
        setImagePreview(product.imageUrl ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [mode, productId, router]);

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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const uploadImageForProduct = async (id: string) => {
    if (removeImage) {
      const res = await fetch(
        `/api/products/upload?productId=${encodeURIComponent(id)}`,
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
    formData.append("productId", id);

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
      const res =
        mode === "edit" && productId
          ? await fetch(`/api/products/${productId}`, {
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

      const savedId = mode === "edit" ? productId : data.product?.id;
      if (savedId && (imageFile || removeImage)) {
        await uploadImageForProduct(savedId);
      }

      sessionStorage.setItem(
        "adminFlash",
        JSON.stringify({
          id: savedId,
          cat: payload.categoryId,
          nome: payload.name,
          type: mode === "create" ? "created" : "updated",
        })
      );
      router.push("/admin");
      router.refresh();
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
      <div className="flex min-h-[50dvh] items-center justify-center text-sm text-[var(--text-muted)]">
        Carregando...
      </div>
    );
  }

  const isCreate = mode === "create";

  return (
    <div className="bg-[var(--bg)]">
      <div className="mx-auto max-w-md bg-[var(--bg)] shadow-xl shadow-stone-200/30">
        <AdminFormHeader
          title={isCreate ? "Cadastrar prato" : "Editar prato"}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-4 py-4 pb-8"
        >
          <AdminField
            label="Foto do prato"
            hint="Galeria ou câmera · até 5 MB"
          >
            <div className="flex items-center gap-3">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Prévia"
                  className="h-20 w-20 shrink-0 rounded-2xl border border-[var(--border)] object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-orange-50">
                  <AppIcon name="restaurant" size={28} color="#ea580c" />
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <ImagePickerButton
                  onChange={handleImageChange}
                  label={imagePreview ? "Trocar foto" : "Escolher da galeria"}
                />
                {(imagePreview || !isCreate) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
          </AdminField>

          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--text)]">
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
                  className={`${adminBtnChip} ${
                    form.categoryId === cat.id
                      ? adminBtnChipActive
                      : adminBtnChipIdle
                  }`}
                >
                  <AppIcon
                    name={cat.icon}
                    size={18}
                    color={form.categoryId === cat.id ? "#c2410c" : "#78716c"}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <AdminField label="Nome do prato">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Ex: Prato feito, Strogonoff..."
              className={adminFieldInputClass}
            />
          </AdminField>

          <AdminField label="Descrição">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              placeholder="Ex: arroz, feijão, bife e salada"
              className={`${adminFieldInputClass} resize-none`}
            />
          </AdminField>

          <AdminField label="Preço (R$)">
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: maskMoneyInput(e.target.value) })
              }
              required
              placeholder="Ex: 24,90"
              className={adminFieldInputClass}
            />
          </AdminField>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3">
            <div>
              <p className="text-sm font-bold text-[var(--text)]">
                Aparece no cardápio?
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {form.active ? "Visível para clientes" : "Escondido"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                form.active ? "bg-green-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  form.active ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Link
              href="/admin"
              className={`flex-1 ${adminBtnSecondary} py-2.5`}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 ${adminBtnPrimary} py-2.5`}
            >
              {saving ? "Salvando..." : "Salvar prato"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
