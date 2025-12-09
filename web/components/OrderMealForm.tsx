"use client";

import { useState, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  mealId: string;
};

export default function OrderMealForm({ mealId }: Props) {
  const { user } = useUser();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      // pas connecté → on redirige vers la page de login
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, // ✅ id Clerk
          items: [
            {
              mealId,
              quantity,
            },
          ],
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Erreur lors de la création de la commande."
        );
      }

      // succès → on va sur la page de mes commandes
      router.push("/orders");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue lors de la commande.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Quantité</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className="w-24 border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Commande en cours…" : "Passer la commande"}
      </button>
    </form>
  );
}
