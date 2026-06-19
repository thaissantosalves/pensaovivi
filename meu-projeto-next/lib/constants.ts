export const STORE = {
  name: "Pensão da Vivi",
  cep: "23017240",
  whatsappNumber: "5521986308008",
  whatsappDisplay: "(21) 98630-8008",
  isOpen: true,
  openHours: "7h às 15h",
  openHoursDetail: "Todos os dias · 7h às 15h",
} as const;

export const PAYMENT_LABELS = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao_debito: "Cartão de débito",
  cartao_credito: "Cartão de crédito",
} as const;

export function getWhatsAppUrl(text?: string): string {
  const base = `https://wa.me/${STORE.whatsappNumber}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
