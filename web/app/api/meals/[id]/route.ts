// app/api/meals/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next 15/16 : params est un Promise -> il faut l'attendre
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params; // ✅ on "await" params

  if (!id) {
    return NextResponse.json(
      { error: "ID du repas manquant." },
      { status: 400 }
    );
  }

  try {
    await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur suppression meal :", error);

    if (error.code === "P2025") {
      // repas introuvable
      return NextResponse.json(
        { error: "Repas introuvable." },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      // repas utilisé dans une commande
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer ce repas car il est déjà utilisé dans au moins une commande.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression du repas." },
      { status: 500 }
    );
  }
}
