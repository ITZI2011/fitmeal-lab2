// web/app/menu/page.tsx
import { prisma } from "@/lib/prisma";
import type { Meal } from "@prisma/client";
import Link from "next/link";

export default async function MenuPage() {
  const meals: Meal[] = await prisma.meal.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Hero menu */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-6 py-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold">
                <span>📋</span>
                <span>Menu FitMeal du jour</span>
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Composez un menu{" "}
                <span className="underline decoration-lime-300 decoration-4">
                  équilibré
                </span>{" "}
                et gourmand
              </h1>
              <p className="text-sm md:text-base text-emerald-50/90">
                Entrées légères, plats protéinés, options véganes et desserts
                sans culpabilité. Sélectionnez vos repas préférés et ajoutez-les
                à votre panier en un clic.
              </p>

              <div className="flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <span>✅</span>
                  <span>Macros équilibrées</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <span>🍽️</span>
                  <span>Idéal pour la semaine</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <span>🕒</span>
                  <span>Prêt en moins de 20 min</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <Link
                href="/meals"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 hover:shadow-xl transition"
              >
                <span>🥗</span>
                <span>Voir tous les repas</span>
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/50 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                <span>🛒</span>
                <span>Mon menu actuel</span>
              </Link>
            </div>
          </div>

          {/* Décor flou */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-lime-300/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-sky-300/40 blur-3xl" />
        </section>

        {/* Section menu */}
        <section className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Menu complet
              </h2>
              <p className="text-sm text-slate-600">
                Choisissez vos plats préférés et ajoutez-les au panier pour
                construire votre menu personnalisé.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>🌿</span>
                <span>Vegan / Végé</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>🔥</span>
                <span>-500 kcal</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>💸</span>
                <span>Budget friendly</span>
              </span>
            </div>
          </div>

          {meals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-800">
                Aucun repas n’est disponible dans le menu pour le moment.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Ajoutez des repas dans la section <span className="font-semibold">Repas</span>{" "}
                pour qu’ils apparaissent ici.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MenuMealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type MenuMealCardProps = {
  meal: Meal;
};

function MenuMealCard({ meal }: MenuMealCardProps) {
  const hasCalories = typeof meal.calories === "number";
  const isLight =
    typeof meal.calories === "number" && meal.calories !== null && meal.calories <= 500;
  const isCheap = meal.price !== null && meal.price <= 20;

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.14)] hover:ring-emerald-200 transition">
      {/* Titre + badges */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900 capitalize">
            {meal.name}
          </h3>
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
          {isLight && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
              ⚖️ Léger (-500 kcal)
            </span>
          )}
          {isCheap && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
              💸 Prix doux
            </span>
          )}
        </div>
      </div>

      {/* Infos nutrition / prix */}
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-slate-700">
          <span>🔥</span>
          <span>{hasCalories ? `${meal.calories} kcal` : "Calories : N/A"}</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-white">
          <span>💳</span>
          <span>
            {meal.price !== null ? `${meal.price.toFixed(2)} $` : "Prix à définir"}
          </span>
        </div>
      </div>

      {/* Ligne du bas */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          Ajoutez ce plat à votre panier depuis la page{" "}
          <span className="font-semibold text-emerald-700">Repas</span>.
        </p>
        <Link
          href="/meals"
          className="text-[11px] font-semibold text-emerald-700 underline underline-offset-4"
        >
          Choisir ce repas
        </Link>
      </div>
    </article>
  );
}
