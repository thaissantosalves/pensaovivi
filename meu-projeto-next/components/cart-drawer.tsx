"use client";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import AppIcon from "@/components/app-icon";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeItem } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-left">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Seu pedido</h2>
            <p className="text-xs text-stone-500">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition"
            aria-label="Fechar"
          >
            <AppIcon name="close" size={20} color="#78716c" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                <AppIcon name="shoppingCart" size={36} color="#ea580c" />
              </div>
              <p className="font-semibold text-stone-700">Carrinho vazio</p>
              <p className="text-sm text-stone-500 mt-1">
                Adicione itens do cardápio para continuar
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-100 bg-amber-50/50 p-4"
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-800 text-sm leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {formatPrice(item.price)} cada
                    </p>
                    {item.notes && (
                      <p className="text-xs text-orange-700/80 mt-1 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-red-500 transition shrink-0"
                    aria-label="Remover item"
                  >
                    <AppIcon name="deleteOutline" size={20} color="currentColor" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center rounded-lg border border-stone-200 bg-white overflow-hidden">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-stone-500 hover:bg-stone-50 font-bold"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-bold text-stone-800 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-orange-600 hover:bg-orange-50 font-bold"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-orange-600 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-stone-600 font-medium">Total</span>
              <span className="text-xl font-extrabold text-stone-800">
                {formatPrice(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 active:scale-[0.98] transition shadow-lg shadow-orange-200"
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
