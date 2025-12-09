// app/meals/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import OrderMealForm from "@/components/OrderMealForm";

// Next 16 : params peut être un Promise
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MealDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">ID du repas manquant.</p>
      </main>
    );
  }

  const meal = await prisma.meal.findUnique({
    where: { id },
  });

  if (!meal) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Repas introuvable.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">{meal.name}</h1>

        <div className="bg-white rounded-xl shadow p-6">
          {meal.description && (
            <p className="mb-3 text-gray-700">{meal.description}</p>
          )}

          <p className="text-sm text-gray-600 mb-1">
            Prix :{" "}
            <span className="font-semibold">{meal.price.toFixed(2)} $</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Calories :{" "}
            <span className="font-semibold">
              {meal.calories != null ? `${meal.calories} kcal` : "Inconnues"}
            </span>
          </p>

          {/* ✅ Formulaire pour passer la commande */}
          <OrderMealForm mealId={meal.id} />
        </div>
      </div>
    </main>
  );
}
