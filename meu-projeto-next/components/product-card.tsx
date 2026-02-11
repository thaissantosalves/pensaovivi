'use client';

import Image from 'next/image';

type ProductCardProps = {
name: string;
description: string;
price: number;
image: string;
};

export default function ProductCard({
name,
description,
price,
image,
}: ProductCardProps) {
return ( <div
   className="
     w-full
     bg-white
     rounded-xl
     shadow-sm
     overflow-hidden
     hover:shadow-md
     transition
   "
 >
{/* Imagem */} <div className="relative w-full h-28 sm:h-36"> <Image
       src={image}
       alt={name}
       fill
       className="object-cover"
     /> </div>

```
  {/* Conteúdo */}
  <div className="p-3 flex flex-col gap-1.5">

    {/* Nome */}
    <h2 className="text-sm sm:text-base font-bold text-gray-800 leading-tight">
      {name}
    </h2>

    {/* Descrição */}
    <p className="text-xs text-gray-600 line-clamp-2">
      {description}
    </p>

    {/* Rodapé */}
    <div className="flex items-center justify-between mt-1">

      {/* Preço */}
      <span className="text-sm sm:text-base font-extrabold text-orange-600">
        R$ {price.toFixed(2)}
      </span>

      {/* Botão */}
      <button
        className="
          bg-orange-500
          text-white
          px-3
          py-1.5
          rounded-lg
          text-xs
          font-semibold
          hover:bg-orange-600
          transition
        "
      >
        Pedir
      </button>

    </div>
  </div>
</div>

);
}