"use client";

import AddIcon from "@mui/icons-material/Add";
import { formatPrice } from "@/lib/format";
import ProductThumbnail from "@/components/product-thumbnail";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="flex items-center gap-3 py-4 border-b border-[var(--border)] last:border-0">
      <ProductThumbnail
        imageUrl={product.imageUrl}
        icon={product.icon}
        alt={product.name}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-bold text-[var(--text)] leading-tight">
          {product.name}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <p className="text-base font-extrabold text-orange-600 mt-1.5">
          {formatPrice(product.price)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onAdd(product)}
        aria-label={`Adicionar ${product.name}`}
        className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-95 transition"
      >
        <AddIcon sx={{ fontSize: 22 }} />
      </button>
    </article>
  );
}
