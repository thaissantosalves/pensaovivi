"use client";

import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import AppIcon from "@/components/app-icon";
import ModalCloseButton from "@/components/modal-close-button";
import { fieldInputLightClass } from "@/lib/input-styles";
import type { Product } from "@/types";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, notes: string) => void;
};

export default function ProductModal({
  product,
  onClose,
  onConfirm,
}: ProductModalProps) {
  useEffect(() => {
    if (!product) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <ProductModalForm
      key={product.id}
      product={product}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

function ProductModalForm({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, notes: string) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const quantity = Number(form.get("quantity"));
    const notes = String(form.get("notes") ?? "");
    onConfirm(product, quantity, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
        <ModalCloseButton
          onClick={onClose}
          variant="dark"
          className="absolute top-3 right-3 z-10"
        />
        <div className="h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <AppIcon name={product.icon} size={48} color="#ffffff" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">{product.name}</h2>
            <p className="text-sm text-stone-500 mt-1">{product.description}</p>
            <p className="text-2xl font-extrabold text-orange-600 mt-3">
              {formatPrice(product.price)}
            </p>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-stone-700 mb-2"
            >
              Quantidade
            </label>
            <div className="flex items-center gap-3">
              <QuantityInput name="quantity" defaultValue={1} />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-semibold text-stone-700 mb-2"
            >
              Observações do item
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Ex: sem cebola, ponto da carne bem passado..."
              className={`${fieldInputLightClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 active:scale-[0.98] transition shadow-md shadow-orange-200"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuantityInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: number;
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-stone-200 overflow-hidden">
      <DecrementButton />
      <input
        type="number"
        name={name}
        id="quantity"
        min={1}
        max={99}
        defaultValue={defaultValue}
        className="w-14 text-center py-2.5 text-base font-bold text-stone-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        readOnly
        data-qty-input
      />
      <IncrementButton />
    </div>
  );
}

function DecrementButton() {
  return (
    <button
      type="button"
      className="px-4 py-2.5 text-lg font-bold text-stone-500 hover:bg-stone-50 transition"
      onClick={(e) => {
        const input = e.currentTarget.parentElement?.querySelector(
          "[data-qty-input]"
        ) as HTMLInputElement | null;
        if (input) input.value = String(Math.max(1, Number(input.value) - 1));
      }}
    >
      −
    </button>
  );
}

function IncrementButton() {
  return (
    <button
      type="button"
      className="px-4 py-2.5 text-lg font-bold text-orange-600 hover:bg-orange-50 transition"
      onClick={(e) => {
        const input = e.currentTarget.parentElement?.querySelector(
          "[data-qty-input]"
        ) as HTMLInputElement | null;
        if (input) input.value = String(Math.min(99, Number(input.value) + 1));
      }}
    >
      +
    </button>
  );
}
