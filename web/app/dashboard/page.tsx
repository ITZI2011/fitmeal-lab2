"use client";

import { useEffect, useState } from "react";

const USER_ID = "cmis8wj1h0000azoq185a10o1"; // même user que partout

type OrderItem = {
  quantity: number;
  meal: {
    calories?: number | null;
  } | null;
};

type Order = {
  id: string;
  createdAt: string;
  status: string | null;
  total: number;
  userId: string;
  items: OrderItem[];
};

type NutritionProfile = {
  caloriesPerDay: number | null;
  goal: string | null;
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [caloriesToday, setCaloriesToday] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, profileRes] = await Promise.all([
          fetch("/api/orders"),
          fetch(`/api/nutrition-profile?userId=${encodeURIComponent(USER_ID)}`),
        ]);

        const ordersData: Order[] = await ordersRes.json();
        const profileData = await profileRes.json();

        // 🧾 Commandes
        if (ordersRes.ok) {
          setOrders(ordersData);

          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);

          const todayOrders = ordersData.filter((o) => {
            const d = new Date(o.createdAt);
            return d >= startOfToday && o.userId === USER_ID;
          });

          const totalCalories = todayOrders.reduce((sumOrder, order) => {
            const orderCals = order.items.reduce((sumItem, item) => {
              const cals = item.meal?.calories ?? 0;
              return sumItem + cals * item.quantity;
            }, 0);
            return sumOrder + orderCals;
          }, 0);

          setCaloriesToday(totalCalories);
        }

        // 👤 Profil nutrition
        if (profileRes.ok && !profileData.error) {
          setProfile({
            caloriesPerDay: profileData.caloriesPerDay ?? null,
            goal: profileData.goal ?? null,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const lastOrder = orders[0] ?? null;
  const totalOrders = orders.length;
  const target = profile?.caloriesPerDay ?? null;
  const ratio =
    target && target > 0 ? Math.min((caloriesToday / target) * 100, 150) : null;

  return (
    <main className="min-h-screen bg-gray-50 p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard FitMeal</h1>
      <p className="text-sm text-gray-500 mb-4">
        Utilisateur : <span className="font-mono">{USER_ID}</span>
      </p>

      {loading ? (
        <p>Chargement du dashboard...</p>
      ) : (
        <>
          {/* Cartes résumé */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">
                Commandes totales
              </h2>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">
                Calories consommées aujourd&apos;hui
              </h2>
              <p className="text-2xl font-bold">
                {caloriesToday.toFixed(0)} kcal
              </p>
              {target && (
                <p className="text-xs text-gray-500 mt-1">
                  Objectif : {target} kcal
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">
                Dernière commande
              </h2>
              {lastOrder ? (
                <>
                  <p className="text-lg font-semibold">
                    {lastOrder.total.toFixed(2)} $
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(lastOrder.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Statut : {lastOrder.status ?? "EN ATTENTE"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Aucune commande.</p>
              )}
            </div>
          </div>

          {/* Barre progression calories */}
          {target && (
            <section className="bg-white rounded-lg shadow p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Progression calories du jour
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-green-500"
                  style={{ width: `${ratio ?? 0}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {ratio?.toFixed(1) ?? 0}% de ton objectif.
              </p>
            </section>
          )}

          {/* Liens rapides */}
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Navigation rapide
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="/menu"
                className="px-4 py-2 rounded bg-black text-white text-sm"
              >
                Commander un repas
              </a>
              <a
                href="/orders"
                className="px-4 py-2 rounded border text-sm text-gray-700"
              >
                Voir mes commandes
              </a>
              <a
                href="/nutrition-profile"
                className="px-4 py-2 rounded border text-sm text-gray-700"
              >
                Mon profil nutrition
              </a>
              <a
                href="/recommendations"
                className="px-4 py-2 rounded border text-sm text-gray-700"
              >
                Recommandations de repas
              </a>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
