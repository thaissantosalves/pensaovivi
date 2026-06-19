import { PAYMENT_LABELS, STORE } from "@/lib/constants";
import { formatPrice, parseMoney } from "@/lib/format";
import type { CartItem, CheckoutData } from "@/types";

const SEPARATOR = "────────────────────";

export function buildWhatsAppMessage(
  items: CartItem[],
  checkout: CheckoutData,
  total: number
): string {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderDate = new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const lines: string[] = [
    `*NOVO PEDIDO — ${STORE.name}*`,
    `Recebido em ${orderDate}`,
    SEPARATOR,
    "",
    "*DADOS DO CLIENTE*",
    `Nome: ${checkout.customerName.trim()}`,
    `Telefone: ${checkout.customerPhone.trim()}`,
    "",
    checkout.deliveryType === "entrega"
      ? buildDeliverySection(checkout)
      : buildPickupSection(),
    "",
    buildPaymentSection(checkout, total),
    "",
    SEPARATOR,
    "",
    `*ITENS DO PEDIDO* (${items.length} ${items.length === 1 ? "item" : "itens"} · ${totalUnits} ${totalUnits === 1 ? "unidade" : "unidades"})`,
    "",
  ];

  items.forEach((item, index) => {
    lines.push(...formatOrderItem(item, index + 1));
    if (index < items.length - 1) lines.push("");
  });

  lines.push(
    "",
    SEPARATOR,
    "",
    "*RESUMO*",
    `Subtotal (${totalUnits} un.): ${formatPrice(total)}`,
    `*TOTAL A PAGAR: ${formatPrice(total)}*`
  );

  if (checkout.generalNotes.trim()) {
    lines.push("", "*OBSERVAÇÕES DO PEDIDO*", checkout.generalNotes.trim());
  }

  lines.push("", SEPARATOR, "_Pedido enviado pelo cardápio digital_");

  return lines.join("\n");
}

function buildPickupSection(): string {
  return ["*RETIRADA NO LOCAL*", "Cliente retira na Pensão da Vivi"].join("\n");
}

function buildDeliverySection(checkout: CheckoutData): string {
  const lines = ["*ENTREGA*", "Tipo: Delivery"];

  if (checkout.address.trim()) {
    lines.push(`Endereço: ${checkout.address.trim()}`);
  } else {
    lines.push("Endereço: _(não informado)_");
  }

  return lines.join("\n");
}

function buildPaymentSection(checkout: CheckoutData, total: number): string {
  const lines = [
    "*FORMA DE PAGAMENTO*",
    `Pagamento: ${PAYMENT_LABELS[checkout.paymentMethod]}`,
  ];

  if (checkout.paymentMethod === "dinheiro") {
    if (checkout.cashChangeOption === "sem_troco") {
      lines.push("Troco: Valor exato (sem troco)");
    } else if (checkout.changeFor.trim()) {
      const payingWith = checkout.changeFor.trim();
      lines.push(`Cliente paga com: ${payingWith}`);

      const paidAmount = parseMoney(payingWith);
      if (paidAmount !== null && paidAmount > total) {
        lines.push(`Troco a devolver: ${formatPrice(paidAmount - total)}`);
      } else if (paidAmount !== null && paidAmount < total) {
        lines.push(
          `_Atenção: valor informado menor que o total do pedido_`
        );
      }
    } else {
      lines.push("Troco: Cliente precisa de troco _(valor não informado)_");
    }
  }

  return lines.join("\n");
}

function formatOrderItem(item: CartItem, index: number): string[] {
  const subtotal = item.price * item.quantity;
  const lines = [
    `*${index}. ${item.name}*`,
    `   ${item.quantity}x ${formatPrice(item.price)}  →  *${formatPrice(subtotal)}*`,
  ];

  if (item.notes.trim()) {
    lines.push(`   Obs: ${item.notes.trim()}`);
  }

  return lines;
}

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE.whatsappNumber}?text=${encoded}`;
}
