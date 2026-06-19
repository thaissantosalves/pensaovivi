"use client";

import { useCallback, useEffect, useState } from "react";
import HeaderComponent from "@/components/header-component";
import HeroSection from "@/components/hero-section";
import CategoryCarousel from "@/components/category-carousel";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import CartDrawer from "@/components/cart-drawer";
import CartBar from "@/components/cart-bar";
import CheckoutSheet from "@/components/checkout-sheet";
import HowItWorks from "@/components/how-it-works";
import SideMenu from "@/components/side-menu";
import { useCart } from "@/context/cart-context";
import type { CategoryId, Product } from "@/types";

export default function MenuPage() {
  const { addItem, itemCount, total } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("refeicoes");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadProducts = useCallback(async (categoryId: CategoryId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${categoryId}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  const filteredProducts = products;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (product: Product, quantity: number, notes: string) => {
    addItem(product, quantity, notes);
    showToast(`${product.name} adicionado!`);
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)] pb-28 overflow-x-hidden">
      <div className="max-w-md mx-auto bg-[var(--bg)] min-h-dvh shadow-xl shadow-stone-200/40 overflow-x-hidden">
        <HeaderComponent onMenuOpen={() => setMenuOpen(true)} />
        <HeroSection />

        <CategoryCarousel
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <main id="cardapio" className="px-4 pt-2 scroll-mt-24">
          <h2 className="font-display text-2xl text-[var(--text)] italic mb-1">
            Cardápio
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Toque no + para personalizar seu pedido
          </p>

          <div className="bg-[var(--surface)] rounded-2xl px-4 shadow-sm border border-[var(--border)]">
            {loading ? (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                Carregando cardápio...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">
                Nenhum item nesta categoria.
              </p>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={setSelectedProduct}
                />
              ))
            )}
          </div>
        </main>

        <HowItWorks />
      </div>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <CartBar
        itemCount={itemCount}
        total={total}
        onClick={() => setCartOpen(true)}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => showToast("Pedido enviado! Aguarde no WhatsApp.")}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium shadow-xl animate-fade-in whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
