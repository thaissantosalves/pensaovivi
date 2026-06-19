"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatPrice } from "@/lib/format";

type CartBarProps = {
  itemCount: number;
  total: number;
  onClick: () => void;
};

export default function CartBar({ itemCount, total, onClick }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 px-4 pb-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex items-center gap-3 bg-[#FACC15] hover:bg-[#EAB308] text-stone-900 px-5 py-4 rounded-2xl shadow-xl shadow-amber-200/60 active:scale-[0.99] transition"
        >
          <div className="relative">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 26 }} />
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          </div>

          <span className="flex-1 text-left font-bold text-sm sm:text-base">
            Ver pedido · {formatPrice(total)}
          </span>

          <ChevronRightIcon sx={{ fontSize: 24 }} />
        </button>
      </div>
    </div>
  );
}
