'use client';

import { useState } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import IcecreamIcon from '@mui/icons-material/Icecream';

type Category = {
id: number;
name: string;
icon: React.ReactNode;
};

const categories: Category[] = [
{ id: 1, name: 'Refeições', icon: <RestaurantIcon /> },
{ id: 2, name: 'Batatas', icon: <FastfoodIcon /> },
{ id: 3, name: 'Bebidas', icon: <LocalDrinkIcon /> },
{ id: 4, name: 'Sobremesas', icon: <IcecreamIcon /> },
];

export default function CategoryCarousel() {
const [active, setActive] = useState<number>(1);

return ( <div className="w-full py-4 bg-amber-50">

  {/* Scroll horizontal */}
  <div
    className="
      flex
      gap-3
      overflow-x-auto
      px-4
      scrollbar-hide
    "
  >
    {categories.map((category) => {
      const isActive = active === category.id;

      return (
        <button
          key={category.id}
          onClick={() => setActive(category.id)}
          className={`
            flex
            items-center
            gap-3
            px-4
            py-2
            rounded-full
            whitespace-nowrap
            border-orange-500
            shadow-sm
            transition
            ${
              isActive
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-300'
            }
          `}
        >
          {/* Badge do ícone */}
          <div
            className={`
              flex
              items-center
              justify-center
              w-8
              h-8
              rounded-full
              ${
                isActive
                  ? 'bg-white/20'
                  : 'bg-orange-100 text-orange-600'
              }
            `}
          >
            {category.icon}
          </div>

          {/* Nome */}
          <span className="text-sm font-semibold">
            {category.name}
          </span>
        </button>
      );
    })}
  </div>
</div>

);
}
