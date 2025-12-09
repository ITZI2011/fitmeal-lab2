// app/admin/meals/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Meal = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  calories: number | null;
};

export default function AdminMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [calories, setCalories] = useState("");

  const router = useRouter();

  // Charger les meals existants
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("/api/meals");
        if (!res.ok) throw new Error("Impossible de charger les meals");
        const data = await res.json();
        setMeals(data);
      } catch (err: any) {
        setError(err.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleCreateMeal = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !description.trim() || !price.trim()) {
      setError("Nom, description et prix sont obligatoires.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          calories: calories ? Number(calories) : null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur lors de la création du meal");
      }

      const newMeal: Meal = await res.json();
      setMeals((prev) => [newMeal, ...prev]);

      setName("");
      setDescription("");
      setPrice("");
      setCalories("");
      setSuccess("Meal créé avec succès 🎉");
    } catch (err: any) {
      setError(err.message ?? "Erreur inconnue");
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Supprimer ce meal ?")) return;
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur lors de la suppression");
      }

      setMeals((prev) => prev.filter((m) => m.id !== id));
      setSuccess("Meal supprimé ✅");
    } catch (err: any) {
      setError(err.message ?? "Erreur inconnue");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-400/70">
              Tableau de bord
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold">
              Admin <span className="text-emerald-400">– Meals</span>
            </h1>
          </div>

          <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
            Espace réservé à l&apos;administrateur
          </span>
        </header>

        {/* Messages */}
        {(error || success) && (
          <div className="space-y-2">
            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Carte création */}
          <section className="rounded-3xl border border-emerald-500/30 bg-slate-900/60 shadow-[0_0_40px_rgba(16,185,129,0.25)] backdrop-blur">
            <div className="border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Ajouter un <span className="text-emerald-400">nouveau meal</span>
              </h2>
              <span className="text-xs text-slate-400">
                Remplis les champs puis clique sur &quot;Créer&quot;
              </span>
            </div>

            <form
              onSubmit={handleCreateMeal}
              className="px-6 py-6 space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Nom
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Ex : bowl protéiné, salade César..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Description
                </label>
                <textarea
                  className="w-full min-h-[90px] rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Ex : poulet grillé, quinoa, légumes verts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Prix ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    placeholder="Ex : 19.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    placeholder="Ex : 600"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Création en cours..." : "Créer le meal"}
                </button>
              </div>
            </form>
          </section>

          {/* Liste des meals */}
          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/70 shadow-xl backdrop-blur">
            <div className="border-b border-slate-700/60 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Liste des meals</h2>
              <span className="text-xs text-slate-400">
                {meals.length} meal{meals.length > 1 ? "s" : ""} au menu
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {loading && (
                <div className="px-6 py-6 text-sm text-slate-400">
                  Chargement des meals…
                </div>
              )}

              {!loading && meals.length === 0 && (
                <div className="px-6 py-6 text-sm text-slate-400">
                  Aucun meal pour le moment. Ajoute ton premier repas 👇
                </div>
              )}

              {!loading &&
                meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-800/60 transition-colors"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {meal.name}
                      </h3>
                      {meal.description && (
                        <p className="mt-1 text-xs text-slate-400">
                          {meal.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-slate-300">
                        Prix :{" "}
                        <span className="font-semibold text-emerald-400">
                          {meal.price ? `${meal.price.toFixed(2)} $` : "—"}
                        </span>{" "}
                        •{" "}
                        <span className="text-slate-400">
                          {meal.calories
                            ? `${meal.calories} kcal`
                            : "Calories inconnues"}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="mt-1 inline-flex items-center rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
