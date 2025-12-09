// app/api/orders/deliver/route.ts
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
          status: "DELIVERED",
        },
      });

      return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "Commande introuvable pour cet orderId" },
          { status: 404 }
        );
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error delivering order:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la livraison de la commande",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
