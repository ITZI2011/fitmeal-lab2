// app/nutrition-profile/page.tsx
"use client";

import Link from "next/link";

type NutritionProfile = {
  name: string;
  goal: string;
  targetCalories: number;
  consumedCalories: number;
  protein: { target: number; consumed: number };
  carbs: { target: number; consumed: number };
  fat: { target: number; consumed: number };
};

type DayStat = {
  label: string;
  calories: number;
  target: number;
  score: number; // 0-100
};

const mockProfile: NutritionProfile = {
  name: "Imane Touraity",
  goal: "Perte de poids légère",
  targetCalories: 2200,
  consumedCalories: 1350,
  protein: { target: 120, consumed: 75 },
  carbs: { target: 240, consumed: 130 },
  fat: { target: 70, consumed: 40 },
};

const last7Days: DayStat[] = [
  { label: "Lun", calories: 2100, target: 2200, score: 88 },
  { label: "Mar", calories: 2300, target: 2200, score: 72 },
  { label: "Mer", calories: 1900, target: 2200, score: 91 },
  { label: "Jeu", calories: 2250, target: 2200, score: 80 },
  { label: "Ven", calories: 2400, target: 2200, score: 68 },
  { label: "Sam", calories: 2000, target: 2200, score: 90 },
  { label: "Dim", calories: 1350, target: 2200, score: 95 },
];

const healthyMeals = [
  {
    name: "Bowl protéiné poulet",
    kcal: 650,
    prot: 45,
    carbs: 60,
    fat: 20,
    tag: "Idéal post-entraînement",
  },
  {
    name: "Salade quinoa & légumes",
    kcal: 350,
    prot: 18,
    carbs: 40,
    fat: 10,
    tag: "Option légère",
  },
  {
    name: "Saumon grillé & riz complet",
    kcal: 520,
    prot: 35,
    carbs: 45,
    fat: 16,
    tag: "Riche en oméga-3",
  },
];

function pct(consumed: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

function getDailyScore(calPct: number, protPct: number) {
  // Mini scoring simple : 70% basé sur calories, 30% sur protéines
  let score = 100;

  const calDiff = Math.abs(100 - calPct); // plus près de 100% = mieux
  if (calDiff > 10) score -= (calDiff - 10) * 0.8;

  const protDiff = Math.abs(100 - protPct);
  if (protDiff > 20) score -= (protDiff - 20) * 0.5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function NutritionProfilePage() {
  const p = mockProfile;

  const calPct = pct(p.consumedCalories, p.targetCalories);
  const protPct = pct(p.protein.consumed, p.protein.target);
  const carbsPct = pct(p.carbs.consumed, p.carbs.target);
  const fatPct = pct(p.fat.consumed, p.fat.target);

  const todayScore = getDailyScore(calPct, protPct);

  const scoreLabel =
    todayScore >= 85
      ? "Excellent"
      : todayScore >= 70
      ? "Bon"
      : todayScore >= 50
      ? "À améliorer"
      : "À surveiller";

  const scoreColor =
    todayScore >= 85
      ? "text-emerald-300 border-emerald-500/50 bg-emerald-500/10"
      : todayScore >= 70
      ? "text-sky-300 border-sky-500/50 bg-sky-500/10"
      : todayScore >= 50
      ? "text-amber-300 border-amber-500/50 bg-amber-500/10"
      : "text-red-300 border-red-500/50 bg-red-500/10";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* En-tête */}
        <header className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-400/70">
              Tableau de bord nutrition
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold">
              Bonjour, <span className="text-emerald-400">{p.name}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Résumé de votre journée : calories, macros, score nutritionnel et
              impact de vos derniers repas FitMeal.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="rounded-3xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-right shadow-lg shadow-emerald-500/25">
              <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/80">
                Objectif du jour
              </p>
              <p className="mt-1 text-lg font-semibold">
                {p.consumedCalories} / {p.targetCalories} kcal
              </p>
              <p className="mt-1 text-xs text-emerald-200/80">
                Progression : {calPct}%
              </p>
            </div>

            <div
              className={`rounded-3xl border px-4 py-2 text-right text-xs font-medium ${scoreColor}`}
            >
              <p className="uppercase tracking-[0.2em] text-[10px] mb-1">
                Score du jour
              </p>
              <p className="text-sm">
                {todayScore}/100 · <span>{scoreLabel}</span>
              </p>
            </div>
          </div>
        </header>

        {/* Grid principale */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bloc gauche : calories + macros + tendance */}
          <div className="xl:col-span-2 space-y-6">
            {/* Carte calories */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-700/70 shadow-xl shadow-emerald-500/15 p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Bilan calorique du jour</h2>
                <span className="text-xs text-slate-400">
                  Calculé à partir de vos repas commandés
                </span>
              </div>

              {/* Barre principale */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Calories consommées</span>
                  <span className="font-medium">
                    {p.consumedCalories} / {p.targetCalories} kcal
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-200"
                    style={{ width: `${calPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    {calPct < 80
                      ? "Encore de la marge pour un repas."
                      : calPct < 100
                      ? "Vous approchez de votre objectif."
                      : "Vous avez dépassé l’objectif calorique du jour."}
                  </span>
                  <span>Score du jour : {todayScore}/100</span>
                </div>
              </div>
            </div>

            {/* Carte macros */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-700/70 p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Répartition des macros</h2>
                <span className="text-xs text-slate-400">
                  Protéines, glucides et lipides
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Protéines */}
                <div className="rounded-2xl bg-slate-900 border border-emerald-500/40 p-4">
                  <p className="text-slate-400">Protéines</p>
                  <p className="mt-1 text-sm font-semibold">
                    {p.protein.consumed} / {p.protein.target} g
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${protPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-200">
                    {protPct}% de votre objectif
                  </p>
                </div>

                {/* Glucides */}
                <div className="rounded-2xl bg-slate-900 border border-sky-500/40 p-4">
                  <p className="text-slate-400">Glucides</p>
                  <p className="mt-1 text-sm font-semibold">
                    {p.carbs.consumed} / {p.carbs.target} g
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-400"
                      style={{ width: `${carbsPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-sky-200">
                    {carbsPct}% de votre objectif
                  </p>
                </div>

                {/* Lipides */}
                <div className="rounded-2xl bg-slate-900 border border-amber-500/40 p-4">
                  <p className="text-slate-400">Lipides</p>
                  <p className="mt-1 text-sm font-semibold">
                    {p.fat.consumed} / {p.fat.target} g
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${fatPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-amber-200">
                    {fatPct}% de votre objectif
                  </p>
                </div>
              </div>
            </div>

            {/* Carte tendance 7 jours */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-700/70 p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Tendance sur les 7 derniers jours
                </h2>
                <span className="text-xs text-slate-400">
                  Objectif : rester proche de 100% de l&apos;objectif calorique
                </span>
              </div>

              <div className="grid grid-cols-7 gap-3 text-[11px]">
                {last7Days.map((day) => {
                  const dayPct = pct(day.calories, day.target);
                  const height = Math.max(10, Math.min(100, dayPct)); // 10-100px

                  const barColor =
                    dayPct >= 90 && dayPct <= 110
                      ? "bg-emerald-400"
                      : dayPct < 90
                      ? "bg-sky-400"
                      : "bg-amber-400";

                  return (
                    <div key={day.label} className="flex flex-col items-center gap-1">
                      <div className="h-24 w-2.5 rounded-full bg-slate-800 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-full ${barColor}`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-slate-400">{day.label}</span>
                      <span className="text-[10px] text-slate-500">
                        {dayPct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bloc droite : objectif + recommandations */}
          <aside className="space-y-6">
            {/* Carte objectifs */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-xl shadow-slate-900/60 p-6 md:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Votre objectif</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Cibles actuelles utilisées par FitMeal.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] bg-emerald-500/15 border border-emerald-400/50 text-emerald-200">
                  {p.goal}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Apport calorique cible</span>
                  <span className="text-slate-100">{p.targetCalories} kcal</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Répartition idéale</span>
                  <span className="text-slate-100">
                    30% protéines • 45% glucides • 25% lipides
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-700/70 pt-4 space-y-3 text-xs text-slate-400">
                <p>
                  Ces paramètres seront utilisés par votre nutritionniste FitMeal
                  pour valider les repas recommandés et ajuster vos menus en
                  fonction de votre progression.
                </p>

                <Link
                  href="/nutrition-profile/edit"
                  className="w-full inline-flex items-center justify-center rounded-2xl border border-emerald-500/70 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20 transition"
                >
                  Mettre à jour mon profil nutrition
                </Link>
              </div>
            </div>

            {/* Carte recommandations */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-700/80 p-6 md:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Recommandations du nutritionniste
                </h2>
                <span className="text-[11px] text-slate-400">
                  Basé sur vos derniers jours
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  • Ajoutez un repas riche en protéines si vous restez en dessous
                  de 80% de votre objectif protéique.
                </li>
                <li>
                  • Évitez de dépasser 110% de votre objectif calorique plus de
                  2 jours d&apos;affilée.
                </li>
                <li>
                  • Privilégiez les repas &quot;Top FitMeal&quot; ci-dessous pour
                  rester dans la zone verte.
                </li>
              </ul>
            </div>
          </aside>
        </section>

        {/* Section Top repas sains */}
        <section className="rounded-3xl bg-slate-900/70 border border-slate-700/70 p-6 md:p-7 mt-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Top repas sains FitMeal</h2>
            <span className="text-xs text-slate-400">
              Suggestions basées sur un bon équilibre calories / protéines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {healthyMeals.map((meal) => (
              <div
                key={meal.name}
                className="rounded-2xl bg-slate-950/80 border border-slate-700/80 p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-50">{meal.name}</h3>
                  <p className="mt-1 text-xs text-emerald-300">{meal.tag}</p>
                </div>
                <div className="mt-3 text-xs text-slate-300 space-y-1">
                  <p>{meal.kcal} kcal</p>
                  <p>
                    {meal.prot} g protéines · {meal.carbs} g glucides ·{" "}
                    {meal.fat} g lipides
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
