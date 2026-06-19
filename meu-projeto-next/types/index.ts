import type { AppIconName } from "@/types/icons";

export type CategoryId = "refeicoes" | "batatas" | "bebidas" | "sobremesas";

export type Product = {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  price: number;
  icon: AppIconName;
  imageUrl?: string | null;
  active?: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};

export type PaymentMethod = "pix" | "dinheiro" | "cartao_debito" | "cartao_credito";

export type CashChangeOption = "sem_troco" | "com_troco";

export type CheckoutData = {
  customerName: string;
  customerPhone: string;
  deliveryType: "retirada" | "entrega";
  address: string;
  paymentMethod: PaymentMethod;
  cashChangeOption: CashChangeOption;
  changeFor: string;
  generalNotes: string;
};
