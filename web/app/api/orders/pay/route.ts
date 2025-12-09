// app/api/orders/pay/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    try {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID", // ou "PAYÉE" selon ta convention
        },
      });

      return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
      // P2025 = record not found
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "Commande introuvable pour cet orderId" },
          { status: 404 }
        );
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error paying order:", error);
    return NextResponse.json(
      {
        error: "Erreur lors du paiement de la commande",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
