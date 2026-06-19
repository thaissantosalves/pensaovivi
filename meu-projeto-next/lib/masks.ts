/** Máscara telefone BR: (21) 99999-9999 ou (21) 9999-9999 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Máscara monetária simples: permite dígitos e vírgula (ex: 24,90) */
export function maskMoneyInput(value: string): string {
  let cleaned = value.replace(/[^\d,]/g, "");

  const commaIndex = cleaned.indexOf(",");
  if (commaIndex !== -1) {
    const intPart = cleaned.slice(0, commaIndex).replace(/,/g, "");
    const decPart = cleaned.slice(commaIndex + 1).replace(/,/g, "").slice(0, 2);
    cleaned = decPart.length > 0 ? `${intPart},${decPart}` : `${intPart},`;
  }

  return cleaned;
}

/** Formata número para exibição em input de preço */
export function formatMoneyInput(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Extrai número de string mascarada */
export function parseMoneyInput(value: string): number {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : NaN;
}

/** Máscara CEP: 23017-240 */
export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
