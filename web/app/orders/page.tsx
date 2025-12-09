// web/app/orders/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrderCardClient from "./OrderCardClient";

// ---------- TYPES PARTAGÉS ----------
export type OrderItemWithMeal = {
  id: string;
  quantity: number;
  meal: {
    name: string;
    price: number | null;
    calories: number | null;
  };
};

export type OrderWithItems = {
  id: string;
  createdAt: Date;
  status?: string | null;
  items: OrderItemWithMeal[];
};
// -----------------------------------

export default async function OrdersPage() {
  const orders = (await prisma.order.findMany({
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as OrderWithItems[];

  const totalOrders = orders.length;

  const totalSpent = orders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((acc, item) => {
      const price = item.meal?.price ?? 0;
      return acc + price * (item.quantity ?? 1);
    }, 0);
    return sum + orderTotal;
  }, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-900 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* HEADER */}
        {/* ... tout ton header inchangé ... */}

        {/* CONTENU */}
        {orders.length === 0 ? (
          // ... bloc "pas de commande" inchangé ...
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center shadow-xl shadow-black/40">
            {/* ... */}
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-100">
                Historique détaillé
              </h2>
              <p className="text-xs text-slate-400">
                Les commandes les plus récentes apparaissent en premier.
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order, index) => (
                <OrderCardClient key={order.id} order={order} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
