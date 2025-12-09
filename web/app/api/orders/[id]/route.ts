// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  id: string;
};

// PATCH = changer le status (PAID, CANCELLED, etc.)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<RouteParams> } // <= Next 16 : params est un Promise
) {
  // ⚠️ il faut "await" sinon params.id est undefined
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Order id manquant dans l'URL" },
      { status: 400 }
    );
  }

  // status par défaut
  let status = "PAID";

  // on laisse la possibilité d'envoyer un autre status (CANCELLED ...)
  try {
    const body = await req.json();
    if (body?.status) {
      status = body.status;
    }
  } catch {
    // pas grave si pas de body
  }

  try {
    const updated = await prisma.order.update({
      // 🚨 très important : on met UNIQUEMENT l'id ici
      where: { id },
      data: { status },
      include: {
        items: { include: { meal: true } },
        user: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PATCH /api/orders/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
}

// DELETE = supprimer / annuler la commande
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Order id manquant dans l'URL" },
      { status: 400 }
    );
  }

  try {
    await prisma.order.delete({
      // ici aussi : il faut l'id
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/orders/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
}
