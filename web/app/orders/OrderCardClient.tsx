// web/app/orders/OrderCardClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrderWithItems } from "./page";
import PayOrderButton from "@/components/PayOrderButton";

type OrderCardProps = {
  order: OrderWithItems;
  index: number;
};

export default function OrderCardClient({ order, index }: OrderCardProps) {
  const [status, setStatus] = useState(order.status ?? "PENDING");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderTotal = order.items.reduce((acc, item) => {
    const price = item.meal?.price ?? 0;
    return acc + price * (item.quantity ?? 1);
  }, 0);

  const totalMeals = order.items.reduce(
    (acc, item) => acc + (item.quantity ?? 1),
    0
  );

  const indexLabel = String(index + 1).padStart(2, "0");

  const createdAt = new Date(order.createdAt as any);
  const formattedDate = createdAt.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const badge =
    status === "CANCELLED"
      ? { label: "Annulée", color: "bg-red-500/15 text-red-300 ring-red-400/40" }
      : status === "PAID"
      ? {
          label: "Payée",
          color: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/40",
        }
      : {
          label: "En préparation",
          color: "bg-amber-500/15 text-amber-300 ring-amber-400/40",
        };

  async function updateStatus(newStatus: "PENDING" | "PAID" | "CANCELLED") {
    if (status === newStatus || updating) return;

    try {
      setUpdating(true);
      setError(null);

      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Erreur lors de la mise à jour.");
        console.error("Erreur PATCH:", data);
        return;
      }

      setStatus(newStatus);
    } catch (err) {
      console.error("Erreur réseau PATCH:", err);
      setError("Erreur réseau lors de la mise à jour.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.6)] ring-1 ring-slate-700/60">
      {/* Bande colorée gauche */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 via-lime-300 to-sky-300" />

      {/* Halos */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Infos principales */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px]">
              #{indexLabel}
            </span>
            <span>Commande du {formattedDate}</span>
          </div>

          <h3 className="text-lg font-semibold text-slate-50">
            {totalMeals} repas •{" "}
            <span className="text-emerald-300">
              {orderTotal.toFixed(2)} $
            </span>
          </h3>

          <div className="space-y-1 text-xs text-slate-300">
            {order.items.slice(0, 3).map((item) => (
              <p key={item.id} className="flex justify-between gap-2">
                <span className="truncate">
                  {item.quantity ?? 1}× {item.meal?.name}
                </span>
                <span className="text-slate-400">
                  {(item.meal?.price ?? 0).toFixed(2)} $
                </span>
              </p>
            ))}
            {order.items.length > 3 && (
              <p className="text-[11px] text-slate-500">
                + {order.items.length - 3} autre(s) plat(s)...
              </p>
            )}
          </div>

          {error && (
            <p className="text-[11px] text-red-300 mt-1">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* Statut + actions */}
        <div className="flex flex-col items-end gap-3 text-xs">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1 ${badge.color}`}
          >
            <span>●</span>
            <span>{badge.label}</span>
          </span>

          <div className="rounded-2xl bg-slate-900/80 px-4 py-3 text-right shadow-inner shadow-black/40">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Total de la commande
            </p>
            <p className="mt-1 text-xl font-extrabold text-emerald-300">
              {orderTotal.toFixed(2)} $
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Inclut tous les repas sélectionnés, taxes comprises.
            </p>
          </div>

          {/* ✅ Actions */}
          <div className="flex flex-col gap-2 w-40">
            {/* Bouton Payer avec Stripe visible tant que la commande n'est pas payée */}
            {status !== "PAID" && (
              <PayOrderButton orderId={order.id} />
            )}

            {status !== "PAID" && (
              <button
                onClick={() => updateStatus("PAID")}
                disabled={updating}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-white font-semibold hover:bg-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Marquer payée
              </button>
            )}

            {status !== "CANCELLED" && (
              <button
                onClick={() => updateStatus("CANCELLED")}
                disabled={updating}
                className="rounded-xl bg-red-600 px-3 py-2 text-white font-semibold hover:bg-red-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            )}

            {status !== "PENDING" && (
              <button
                onClick={() => updateStatus("PENDING")}
                disabled={updating}
                className="rounded-xl bg-amber-600 px-3 py-2 text-white font-semibold hover:bg-amber-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                En préparation
              </button>
            )}
          </div>

          {/* Lien vers le profil nutrition */}
          <Link
            href="/nutrition-profile"
            className="text-emerald-400 underline text-sm mt-3"
          >
            Voir l’impact sur mon profil nutrition
          </Link>
        </div>
      </div>
    </article>
  );
}
