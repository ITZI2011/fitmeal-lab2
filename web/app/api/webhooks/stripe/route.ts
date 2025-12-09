import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Important pour Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Erreur de signature Webhook :", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 🎯 Cible : checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    console.log("🎉 Paiement confirmé pour la session :", session.id);

    // ID de la commande envoyée dans metadata
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      console.log("💰 Commande mise à jour en PAID :", orderId);
    }
  }

  return new NextResponse("Webhook OK", { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: "Stripe webhook endpoint" });
}
