import type { AppIconName } from "@/types/icons";
import type { CategoryId } from "@/types";

export type Category = {
  id: CategoryId;
  name: string;
  icon: AppIconName;
};

export const categories: Category[] = [
  { id: "refeicoes", name: "Refeições", icon: "restaurant" },
  { id: "batatas", name: "Batatas", icon: "fastfood" },
  { id: "bebidas", name: "Bebidas", icon: "localDrink" },
  { id: "sobremesas", name: "Sobremesas", icon: "icecream" },
];

export const PRODUCT_ICONS: AppIconName[] = [
  "lunchDining",
  "riceBowl",
  "soupKitchen",
  "kebabDining",
  "fastfood",
  "restaurant",
  "localBar",
  "localCafe",
  "waterDrop",
  "cake",
  "cookie",
  "localDrink",
  "icecream",
];
