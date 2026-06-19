import type { CartItem, CheckoutData } from "@/types";

const CART_KEY = "pensaovivi_cart";
const CHECKOUT_KEY = "pensaovivi_checkout";

type StoredCart = {
  items: CartItem[];
  checkout: CheckoutData;
};

const defaultCheckout: CheckoutData = {
  customerName: "",
  customerPhone: "",
  deliveryType: "retirada",
  address: "",
  paymentMethod: "pix",
  cashChangeOption: "sem_troco",
  changeFor: "",
  generalNotes: "",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadCartFromStorage(): StoredCart {
  if (!isBrowser()) {
    return { items: [], checkout: defaultCheckout };
  }

  try {
    const rawItems = localStorage.getItem(CART_KEY);
    const rawCheckout = localStorage.getItem(CHECKOUT_KEY);

    const items: CartItem[] = rawItems ? JSON.parse(rawItems) : [];
    const checkout: CheckoutData = rawCheckout
      ? { ...defaultCheckout, ...JSON.parse(rawCheckout) }
      : defaultCheckout;

    return {
      items: Array.isArray(items) ? items : [],
      checkout,
    };
  } catch {
    return { items: [], checkout: defaultCheckout };
  }
}

export function saveCartItemsToStorage(items: CartItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function saveCheckoutToStorage(checkout: CheckoutData) {
  if (!isBrowser()) return;
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
}

export function clearCartStorage() {
  if (!isBrowser()) return;
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CHECKOUT_KEY);
}

export { defaultCheckout };
