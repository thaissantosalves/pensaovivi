"use client";

import Image from "next/image";
import { STORE } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="bg-[#FACC15] mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-stretch min-h-[130px]">
        <div className="flex-1 px-5 py-5 flex flex-col justify-center">
          <h2 className="font-display text-xl sm:text-2xl text-stone-900 leading-snug italic">
            Comida caseira
            <br />
            feita com amor!
          </h2>
          <p className="text-xs sm:text-sm text-stone-700/80 mt-2 leading-relaxed max-w-[200px]">
            Escolha seus pratos e finalize seu pedido pelo WhatsApp.
          </p>

          <div className="flex items-center gap-1.5 mt-3">
            <span
              className={`w-2 h-2 rounded-full ${
                STORE.isOpen ? "bg-green-600" : "bg-red-500"
              }`}
            />
            <span className="text-xs font-semibold text-stone-800">
              {STORE.isOpen ? "Aberto agora" : "Fechado"}
            </span>
            <span className="text-stone-600/50 text-xs">·</span>
            <span className="text-xs text-stone-700/70">
              {STORE.openHoursDetail}
            </span>
          </div>
        </div>

        <div className="relative w-[120px] sm:w-[140px] shrink-0 flex items-end justify-center pr-2">
          <div className="absolute inset-0 bg-gradient-to-l from-[#FACC15] via-transparent to-transparent z-10" />
          <Image
            src="/logo.png"
            alt=""
            width={110}
            height={110}
            className="object-contain drop-shadow-lg relative z-0 translate-y-2"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
