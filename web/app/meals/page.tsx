// web/app/meals/page.tsx
import { prisma } from "@/lib/prisma";
import MealActions from "@/components/MealActions";
import Link from "next/link";
import type { Meal } from "@prisma/client";

export default async function MealsPage() {
  const meals: Meal[] = await prisma.meal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Bandeau top */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-1 text-xs font-semibold text-white shadow-md shadow-emerald-300/60">
              <span>🥗</span>
              <span>Catalogue FitMeal</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Explorez nos{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  repas santé
                </span>
              </h1>
              <p className="max-w-xl text-sm md:text-base text-slate-600">
                Des plats colorés, équilibrés et gourmands pour booster votre
                énergie au quotidien. Ajoutez-les à votre panier et composez un
                menu qui correspond à vos objectifs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>🔥</span>
                <span>Haute teneur en protéines</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>🌿</span>
                <span>Options végétariennes & véganes</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>⏱️</span>
                <span>Prêt en quelques minutes</span>
              </span>
            </div>
          </div>

          {/* Boutons rapides */}
          <div className="flex flex-col items-stretch gap-3 md:items-end">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-md shadow-emerald-100 ring-1 ring-emerald-200 hover:-translate-y-0.5 hover:shadow-lg transition"
            >
              <span>🛒</span>
              <span>Voir mon panier</span>
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-700/40 hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              <span>📦</span>
              <span>Mes dernières commandes</span>
            </Link>
          </div>
        </header>

        {/* Grille des repas */}
        {meals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-emerald-800">
              Aucun repas n’a encore été créé.
            </p>
            <p className="mt-2 text-sm text-emerald-700">
              Ajoutez vos premiers repas pour commencer à construire votre menu
              FitMeal.
            </p>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

type MealCardProps = {
  meal: Meal;
};

function MealCard({ meal }: MealCardProps) {
  const isCheap = meal.price !== null && meal.price < 15;
  const hasCalories = typeof meal.calories === "number";

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,118,110,0.06)] ring-1 ring-emerald-100/70 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,118,110,0.12)] hover:ring-emerald-300/80 transition">
      {/* Titre + badges */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 capitalize">
            {meal.name}
          </h2>
          {meal.description && (
            <p className="text-xs text-slate-600 line-clamp-2">
              {meal.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {meal.isVegan && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              🌿 Vegan
            </span>
          )}
          {isCheap && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
              💸 Budget friendly
            </span>
          )}
        </div>
      </div>

      {/* Infos nutrition / prix */}
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-1 text-slate-700">
          <span>🔥</span>
          <span>{hasCalories ? `${meal.calories} kcal` : "Calories : N/A"}</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-white">
          <span>💳</span>
          <span>
            {meal.price !== null
              ? `${meal.price.toFixed(2)} $`
              : "Prix à définir"}
          </span>
        </div>
      </div>

      {/* Message */}
      <p className="mt-4 text-xs text-slate-500">
        Ajoutez ce repas à votre panier, personnalisez les quantités et
        intégrez-le à votre menu de la semaine.
      </p>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Recette FitMeal validée par nos nutritionnistes</span>
        </div>

        {/* Composant existant (ajout panier / edit / delete) */}
        <MealActions meal={meal} />
      </div>
    </article>
  );
}
