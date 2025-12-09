"use client";

import { useCart } from "@/components/CartContext";

type MealActionProps = {
  meal: {
    id: string;
    name: string | null;
    price: number;
  };
};

export default function MealActions({ meal }: MealActionProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(
      {
        mealId: meal.id,
        name: meal.name ?? "Sans nom",
        price: meal.price,
      },
      1
    );
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center gap-1 rounded-full border border-emerald-600 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
    >
      + Ajouter au panier
    </button>
  );
}
