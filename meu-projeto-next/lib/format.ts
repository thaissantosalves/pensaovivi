export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseMoney(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (!normalized) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}
