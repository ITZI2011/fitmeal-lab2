"use client";

import { useState } from "react";

type PayOrderButtonProps = {
  orderId: string;
};

export default function PayOrderButton({ orderId }: PayOrderButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur Stripe");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
    >
      {loading ? "Redirection..." : "Payer avec Stripe"}
    </button>
  );
}
