"use client";

import { useEffect, useState } from "react";

const USER_ID = "cmis8wj1h0000azoq185a10o1";

type Meal = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  calories?: number | null;
};

type ApiResponse = {
  recommendations: Meal[];
  note?: string;
};

export default function RecommendationsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(
          `/api/recommendations?userId=${encodeURIComponent(USER_ID)}`
        );
        const json = await res.json();
        if (res.ok) {
          setData(json);
          setMessage(json.note ?? null);
        } else {
          setMessage(json.error ?? "Erreur lors des recommandations.");
        }
      } catch (e) {
        console.error(e);
        setMessage("Erreur réseau lors des recommandations.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">
        Recommandations de repas FitMeal
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Utilisateur : <span className="font-mono">{USER_ID}</span>
      </p>

      {message && (
        <p className="mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded px-3 py-2">
          {message}
        </p>
      )}

      {loading ? (
        <p>Chargement des recommandations...</p>
      ) : !data || data.recommendations.length === 0 ? (
        <p>Aucune recommandation disponible.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.recommendations.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1">{meal.name}</h2>
                {meal.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {meal.description}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  Prix :{" "}
                  <span className="font-semibold">
                    {meal.price.toFixed(2)} $
                  </span>
                </p>
                {meal.calories != null && (
                  <p className="text-xs text-gray-500 mt-1">
                    {meal.calories} kcal
                  </p>
                )}
              </div>
              <a
                href="/menu"
                className="mt-3 inline-block text-center w-full bg-black text-white rounded py-2 text-sm font-medium"
              >
                Commander ce type de repas
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
