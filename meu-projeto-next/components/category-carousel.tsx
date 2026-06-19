"use client";

import { categories } from "@/lib/menu-data";
import AppIcon from "@/components/app-icon";
import type { CategoryId } from "@/types";

type CategoryCarouselProps = {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
};

export default function CategoryCarousel({
  active,
  onChange,
}: CategoryCarouselProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {categories.map((category) => {
        const isActive = active === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition shrink-0
              ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300"
              }
            `}
          >
            <AppIcon
              name={category.icon}
              size={16}
              color={isActive ? "#ffffff" : "#ea580c"}
            />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
