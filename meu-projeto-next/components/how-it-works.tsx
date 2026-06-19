import AppIcon from "@/components/app-icon";
import type { AppIconName } from "@/types/icons";

const steps: {
  icon: AppIconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "restaurantMenu",
    title: "Escolha seus pratos",
    description: "Navegue pelo cardápio e monte seu pedido.",
  },
  {
    icon: "shoppingBag",
    title: "Revise seu pedido",
    description: "Confira itens, quantidades e observações.",
  },
  {
    icon: "chatBubble",
    title: "Finalize via WhatsApp",
    description: "Envie tudo pronto e aguarde a confirmação.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-4 mt-8 mb-6 bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] scroll-mt-24">
      <h3 className="font-display text-lg text-stone-800 italic mb-4">
        Como funciona
      </h3>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <AppIcon name={step.icon} size={20} color="#ea580c" />
            </span>
            <div>
              <p className="text-sm font-bold text-stone-800">
                {index + 1}. {step.title}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
