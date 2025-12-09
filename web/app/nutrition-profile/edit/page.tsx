// app/nutrition-profile/edit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditNutritionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    goal: "Perte de poids légère",
    targetCalories: 2200,
    protein: 120,
    carbs: 240,
    fat: 70,
    targetWeight: 60,
    activityLevel: "Modéré",
  });

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // 🔥 important pour éviter le POST /nutrition/edit

    // Ici tu brancheras ton API / Prisma plus tard
    console.log("Nouveau profil nutrition :", form);

    // Retour au profil
    router.push("/nutrition-profile");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">
          Mettre à jour mon profil nutrition
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-900/70 p-6 rounded-3xl border border-slate-700"
        >
          {/* Objectif */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              Objectif nutritionnel
            </label>
            <select
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.goal}
              onChange={(e) => updateField("goal", e.target.value)}
            >
              <option>Perte de poids légère</option>
              <option>Prise de masse</option>
              <option>Maintien du poids</option>
            </select>
          </div>

          {/* Calories */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Calories cibles (kcal)</label>
            <input
              type="number"
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.targetCalories}
              onChange={(e) =>
                updateField("targetCalories", Number(e.target.value))
              }
            />
          </div>

          {/* Protéines */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Protéines cibles (g)</label>
            <input
              type="number"
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.protein}
              onChange={(e) => updateField("protein", Number(e.target.value))}
            />
          </div>

          {/* Glucides */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Glucides cibles (g)</label>
            <input
              type="number"
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.carbs}
              onChange={(e) => updateField("carbs", Number(e.target.value))}
            />
          </div>

          {/* Lipides */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Lipides cibles (g)</label>
            <input
              type="number"
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.fat}
              onChange={(e) => updateField("fat", Number(e.target.value))}
            />
          </div>

          {/* Poids cible */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Poids cible (kg)</label>
            <input
              type="number"
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.targetWeight}
              onChange={(e) =>
                updateField("targetWeight", Number(e.target.value))
              }
            />
          </div>

          {/* Activité */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              Niveau d&apos;activité
            </label>
            <select
              className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
              value={form.activityLevel}
              onChange={(e) => updateField("activityLevel", e.target.value)}
            >
              <option>Faible</option>
              <option>Modéré</option>
              <option>Intense</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.push("/nutrition-profile")}
              className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
