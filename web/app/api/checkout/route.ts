// web/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body as { orderId?: string };

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId est obligatoire" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            meal: true,
          },
        },
      },
    });

    if (!order || order.items.length === 0) {
      return NextResponse.json(
        { error: "Commande introuvable ou vide" },
        { status: 404 }
      );
    }

    const line_items = order.items.map((item) => {
      const price = Number(item.meal.price ?? 0);

      return {
        price_data: {
          currency: "cad", // change en "eur" si tu veux
          product_data: {
            name: item.meal.name,
          },
          unit_amount: Math.round(price * 100), // Stripe = en centimes
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/cancel?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe Checkout:", error);
    return NextResponse.json(
      { error: "Erreur interne lors de la création du paiement" },
      { status: 500 }
    );
  }
}
