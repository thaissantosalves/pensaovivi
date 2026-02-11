import Image from 'next/image';

export default function HeaderComponent() {
  const isOpen = true; // depois tu pode ligar isso na lógica real

  return (
    <header
      className="
        w-full
        text-black
        py-0
        shadow-md
        bg-white
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          flex
          items-end
          justify-between
        "
      >
        {/* ESQUERDA → Logo + Infos */}
        <div className="flex items-end gap-4">
          
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Logo Pensão da Vivi"
            width={90}
            height={90}
            className="object-contain"
            priority
          />

          {/* BLOCO TEXTO */}
          <div className="flex flex-col justify-end pb-2">
            
            {/* Nome */}
            <h1
              className="
                text-2xl
                md:text-3xl
                font-extrabold
                tracking-wide
              "
            >
              Pensão da Vivi
            </h1>

            {/* Status */}
            <div className="flex items-center gap-2 mt-1">
              
              {/* Bolinha */}
              <span
                className={`
                  w-3 h-3 rounded-full
                  ${isOpen ? 'bg-green-500' : 'bg-red-500'}
                `}
              />

              <p
                className={`
                  text-sm font-semibold
                  ${isOpen ? 'text-green-600' : 'text-red-600'}
                `}
              >
                {isOpen ? 'Aberto agora' : 'Fechado no momento'}
              </p>
            </div>

            {/* Endereço */}
            <p className="text-sm text-gray-600">
              R. Basílio Torreão - Campo Grande - RJ, 23017-240
            </p>
          </div>
        </div>

        {/* DIREITA → futuro (botões/menu) */}
        <div className="hidden md:flex items-center gap-4 pb-2">
          {/* espaço reservado */}
        </div>
      </div>
    </header>
  );
}
