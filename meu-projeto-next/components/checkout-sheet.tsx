"use client";

import { useEffect, useState } from "react";
import { formatPrice, parseMoney } from "@/lib/format";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCart } from "@/context/cart-context";
import PaymentMethodSelector from "@/components/payment-method-selector";
import AppIcon from "@/components/app-icon";
import { fieldInputLightClass } from "@/lib/input-styles";
import { maskPhone } from "@/lib/masks";
import type { PaymentMethod } from "@/types";
import type { AppIconName } from "@/types/icons";

type CheckoutSheetProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CheckoutSheet({
  open,
  onClose,
  onSuccess,
}: CheckoutSheetProps) {
  const { items, total, checkout, setCheckout, clearCart, resetCheckout } =
    useCart();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkout.customerName.trim()) {
      setError("Informe seu nome para continuar.");
      return;
    }
    if (!checkout.customerPhone.trim()) {
      setError("Informe seu telefone para contato.");
      return;
    }
    if (checkout.deliveryType === "entrega" && !checkout.address.trim()) {
      setError("Informe o endereço para entrega.");
      return;
    }
    if (items.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }
    if (
      checkout.paymentMethod === "dinheiro" &&
      checkout.cashChangeOption === "com_troco"
    ) {
      if (!checkout.changeFor.trim()) {
        setError("Informe com quanto você vai pagar para calcular o troco.");
        return;
      }
      const paidAmount = parseMoney(checkout.changeFor);
      if (paidAmount === null || paidAmount < total) {
        setError("O valor informado deve ser igual ou maior que o total do pedido.");
        return;
      }
    }

    const message = buildWhatsAppMessage(items, checkout, total);
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");

    clearCart();
    resetCheckout();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Fechar checkout"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[90dvh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-800">
                Finalizar pedido
              </h2>
              <p className="text-xs text-stone-500">
                Você será redirecionado ao WhatsApp
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
        </div>

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="sheet-scroll flex-1 px-5 py-4 space-y-5"
        >
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
              Seus dados
            </h3>
            <Field label="Nome" required>
              <input
                type="text"
                value={checkout.customerName}
                onChange={(e) => setCheckout({ customerName: e.target.value })}
                placeholder="Como podemos te chamar?"
                className={inputClass}
              />
            </Field>
            <Field label="Telefone / WhatsApp" required>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={checkout.customerPhone}
                onChange={(e) =>
                  setCheckout({ customerPhone: maskPhone(e.target.value) })
                }
                placeholder="(21) 99999-9999"
                className={inputClass}
              />
            </Field>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
              Entrega
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton
                active={checkout.deliveryType === "retirada"}
                onClick={() => setCheckout({ deliveryType: "retirada" })}
                icon="storefront"
                label="Retirada"
              />
              <ToggleButton
                active={checkout.deliveryType === "entrega"}
                onClick={() => setCheckout({ deliveryType: "entrega" })}
                icon="deliveryDining"
                label="Entrega"
              />
            </div>
            {checkout.deliveryType === "entrega" && (
              <Field label="Endereço completo" required>
                <textarea
                  value={checkout.address}
                  onChange={(e) => setCheckout({ address: e.target.value })}
                  placeholder="Rua, número, complemento, bairro..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            )}
          </section>

          <PaymentMethodSelector
            paymentMethod={checkout.paymentMethod}
            cashChangeOption={checkout.cashChangeOption}
            changeFor={checkout.changeFor}
            orderTotal={total}
            onPaymentMethodChange={(method: PaymentMethod) =>
              setCheckout({ paymentMethod: method })
            }
            onCashChangeOptionChange={(option) =>
              setCheckout({ cashChangeOption: option })
            }
            onChangeForChange={(value) => setCheckout({ changeFor: value })}
          />

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
              Observações gerais
            </h3>
            <textarea
              value={checkout.generalNotes}
              onChange={(e) => setCheckout({ generalNotes: e.target.value })}
              placeholder="Alguma instrução extra para o pedido?"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </section>

          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">Total do pedido</span>
              <span className="text-xl font-extrabold text-orange-600">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium bg-red-50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </form>

        <div className="px-5 py-4 border-t border-stone-100 shrink-0 bg-white">
          <button
            type="submit"
            form="checkout-form"
            className="w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20bd5a] active:scale-[0.98] transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
          >
            <WhatsAppIcon />
            Enviar pedido pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass = fieldInputLightClass;

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">
        {label}
        {required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: AppIconName;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition
        ${
          active
            ? "border-orange-500 bg-orange-50 text-orange-700"
            : "border-stone-200 bg-white text-stone-600 hover:border-orange-200"
        }
      `}
    >
      <AppIcon
        name={icon}
        size={20}
        color={active ? "#c2410c" : "#78716c"}
      />
      {label}
    </button>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
