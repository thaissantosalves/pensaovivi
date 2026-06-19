"use client";

import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PAYMENT_LABELS } from "@/lib/constants";
import { formatPrice, parseMoney } from "@/lib/format";
import AppIcon from "@/components/app-icon";
import type { CashChangeOption, PaymentMethod } from "@/types";
import type { PaymentIconName } from "@/types/icons";

const paymentOptions: {
  value: PaymentMethod;
  label: string;
  icon: PaymentIconName;
}[] = [
  { value: "pix", label: PAYMENT_LABELS.pix, icon: "qrCode" },
  { value: "dinheiro", label: PAYMENT_LABELS.dinheiro, icon: "payments" },
  { value: "cartao_debito", label: PAYMENT_LABELS.cartao_debito, icon: "creditCard" },
  { value: "cartao_credito", label: PAYMENT_LABELS.cartao_credito, icon: "creditCard" },
];

type PaymentMethodSelectorProps = {
  paymentMethod: PaymentMethod;
  cashChangeOption: CashChangeOption;
  changeFor: string;
  orderTotal: number;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCashChangeOptionChange: (option: CashChangeOption) => void;
  onChangeForChange: (value: string) => void;
};

export default function PaymentMethodSelector({
  paymentMethod,
  cashChangeOption,
  changeFor,
  orderTotal,
  onPaymentMethodChange,
  onCashChangeOptionChange,
  onChangeForChange,
}: PaymentMethodSelectorProps) {
  const [expanded, setExpanded] = useState(false);

  const selectedOption =
    paymentOptions.find((o) => o.value === paymentMethod) ?? paymentOptions[0];

  const paidAmount = parseMoney(changeFor);
  const changeAmount =
    paidAmount !== null && paidAmount > orderTotal
      ? paidAmount - orderTotal
      : null;

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl border border-stone-200 bg-white hover:border-orange-200 transition text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <AppIcon name={selectedOption.icon} size={22} color="#ea580c" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Forma de pagamento
            </p>
            <p className="text-sm font-bold text-stone-800 truncate">
              {selectedOption.label}
              {paymentMethod === "dinheiro" && (
                <span className="font-medium text-stone-500">
                  {" "}
                  ·{" "}
                  {cashChangeOption === "sem_troco"
                    ? "Sem troco"
                    : "Com troco"}
                </span>
              )}
            </p>
          </div>
        </div>
        <ExpandMoreIcon
          sx={{
            fontSize: 22,
            color: "#78716c",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {expanded && (
        <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-3 space-y-3">
          <p className="text-xs font-semibold text-stone-500 px-1">
            Escolha como deseja pagar
          </p>

          <div className="grid grid-cols-2 gap-2">
            {paymentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onPaymentMethodChange(option.value);
                  if (option.value !== "dinheiro") {
                    onCashChangeOptionChange("sem_troco");
                    onChangeForChange("");
                  }
                }}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border text-left text-sm font-semibold transition
                  ${
                    paymentMethod === option.value
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                      : "border-stone-200 bg-white text-stone-600 hover:border-orange-200"
                  }
                `}
              >
                <AppIcon
                  name={option.icon}
                  size={20}
                  color={paymentMethod === option.value ? "#c2410c" : "#78716c"}
                />
                <span className="leading-tight">{option.label}</span>
              </button>
            ))}
          </div>

          {paymentMethod === "dinheiro" && (
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold text-stone-500 px-1">
                Precisa de troco?
              </p>

              <div className="grid grid-cols-2 gap-2">
                <CashOptionButton
                  active={cashChangeOption === "sem_troco"}
                  onClick={() => {
                    onCashChangeOptionChange("sem_troco");
                    onChangeForChange("");
                  }}
                  label="Sem troco"
                  description="Valor exato"
                />
                <CashOptionButton
                  active={cashChangeOption === "com_troco"}
                  onClick={() => onCashChangeOptionChange("com_troco")}
                  label="Com troco"
                  description="Informar valor"
                />
              </div>

              {cashChangeOption === "com_troco" && (
                <div className="space-y-2">
                  <label
                    htmlFor="change-for"
                    className="block text-sm font-semibold text-stone-700"
                  >
                    Vou pagar com
                  </label>
                  <input
                    id="change-for"
                    type="text"
                    inputMode="decimal"
                    value={changeFor}
                    onChange={(e) => onChangeForChange(e.target.value)}
                    placeholder="Ex: R$ 50,00"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  />

                  {paidAmount !== null && paidAmount < orderTotal && (
                    <p className="text-xs text-red-600 font-medium">
                      O valor informado é menor que o total do pedido (
                      {formatPrice(orderTotal)}).
                    </p>
                  )}

                  {changeAmount !== null && (
                    <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2.5">
                      <p className="text-xs text-green-700 font-medium">
                        Troco estimado
                      </p>
                      <p className="text-base font-extrabold text-green-800">
                        {formatPrice(changeAmount)}
                      </p>
                    </div>
                  )}

                  {paidAmount !== null &&
                    paidAmount === orderTotal &&
                    cashChangeOption === "com_troco" && (
                      <p className="text-xs text-stone-500">
                        Valor exato — sem necessidade de troco.
                      </p>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function CashOptionButton({
  active,
  onClick,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-3 rounded-xl border text-left transition
        ${
          active
            ? "border-orange-500 bg-orange-50 text-orange-700"
            : "border-stone-200 bg-white text-stone-600 hover:border-orange-200"
        }
      `}
    >
      <p className="text-sm font-bold">{label}</p>
      <p className="text-[11px] opacity-70 mt-0.5">{description}</p>
    </button>
  );
}
