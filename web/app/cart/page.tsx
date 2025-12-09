"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { userId } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasItems = items && items.length > 0;

  async function handleConfirmOrder() {
    setMessage(null);

    if (!userId) {
      setMessage("Vous devez être connecté pour confirmer votre commande.");
      return;
    }

    if (!hasItems) {
      setMessage("Votre panier est vide.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId,
        items: items.map((item: any) => ({
          mealId: item.mealId || item.id,
          quantity: item.quantity ?? 1,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = "Erreur lors de la création de la commande.";
        try {
          const data = await res.json();
          if (data?.error) errorMsg = data.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      clearCart();
      setMessage("✅ Commande confirmée avec succès !");
      // Redirige vers la page des commandes
      router.push("/orders");
    } catch (err: any) {
      setMessage(err?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        {/* Hero / header */}
        <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 text-xs font-semibold text-white shadow-md shadow-emerald-300/60">
              <span>🛒</span>
              <span>Panier FitMeal</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Votre{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
                  menu en préparation
                </span>
              </h1>
              <p className="max-w-xl text-sm md:text-base text-slate-600">
                Vérifiez vos repas, ajustez les quantités et confirmez votre
                commande. Chaque plat est pensé pour vous aider à atteindre vos
                objectifs nutritionnels.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>✅</span>
                <span>Suivi des calories simplifié</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>🌿</span>
                <span>Options saines et équilibrées</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span>⚡</span>
                <span>Idéal pour la semaine</span>
              </span>
            </div>
          </div>

          {/* Résumé rapide */}
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 px-6 py-5 text-sm text-slate-50 shadow-xl shadow-slate-900/40">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Récapitulatif
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-sm text-slate-300">Nombre de repas</p>
              <p className="text-xl font-bold">{totalItems ?? 0}</p>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-sm text-slate-300">Total estimé</p>
              <p className="text-xl font-bold">
                {totalPrice ? totalPrice.toFixed(2) : "0.00"} $
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/meals"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition"
              >
                <span>➕</span>
                <span>Ajouter d’autres repas</span>
              </Link>
              {hasItems && (
                <button
                  onClick={clearCart}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                >
                  <span>🧹</span>
                  <span>Vider le panier</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Message global */}
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {/* Contenu du panier */}
        {!hasItems ? (
          <section className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-800">
              Votre panier est vide pour le moment.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Explorez nos{" "}
              <Link href="/meals" className="font-semibold text-emerald-600">
                repas
              </Link>{" "}
              et ajoutez vos plats préférés à votre menu.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
            {/* Liste des items */}
            <div className="space-y-4">
              {items.map((item: any) => (
                <CartItemCard
                  key={item.mealId || item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </div>

            {/* Résumé détaillé */}
            <div className="space-y-4 rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                Détail de la commande
              </h2>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>
                    {totalPrice ? totalPrice.toFixed(2) : "0.00"} $
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="text-emerald-600 font-medium">Offerts</span>
                </div>
                <div className="flex justify-between">
                  <span>T.V.A.</span>
                  <span>Incluse</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {totalPrice ? totalPrice.toFixed(2) : "0.00"} $
                </span>
              </div>

              <button
                disabled={loading || !hasItems}
                onClick={handleConfirmOrder}
                className="mt-3 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-300/60 hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Enregistrement de la commande..." : "Confirmer ma commande"}
              </button>

              <p className="mt-2 text-[11px] text-slate-500">
                En confirmant, vous recevrez un récapitulatif par email avec la
                liste de vos repas et les instructions de préparation.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

type CartItemCardProps = {
  item: any;
  updateQuantity: (mealId: string, quantity: number) => void;
  removeItem: (mealId: string) => void;
};

function CartItemCard({ item, updateQuantity, removeItem }: CartItemCardProps) {
  const mealId = item.mealId || item.id;
  const name = item.name || item.mealName || "Repas";
  const price = item.price ?? 0;
  const calories = item.calories ?? null;
  const quantity = item.quantity ?? 1;

  const handleChangeQuantity = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty <= 0) {
      removeItem(mealId);
    } else {
      updateQuantity(mealId, newQty);
    }
  };

  return (
    <article className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-200 to-teal-300 text-2xl">
        🥗
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 capitalize">
              {name}
            </h3>
            {calories !== null && (
              <p className="text-xs text-slate-500">{calories} kcal</p>
            )}
          </div>
          <button
            onClick={() => removeItem(mealId)}
            className="text-xs text-slate-400 hover:text-red-500"
          >
            Retirer
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-xs">
            <button
              onClick={() => handleChangeQuantity(-1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm hover:bg-slate-100"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => handleChangeQuantity(1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">Prix unitaire</p>
            <p className="text-sm font-semibold text-slate-900">
              {price.toFixed(2)} $
            </p>
            <p className="text-[11px] text-slate-500">
              Sous-total : {(price * quantity).toFixed(2)} $
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
