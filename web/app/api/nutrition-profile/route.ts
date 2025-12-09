import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type NutritionProfileInput = {
  userId: string;
  goal?: string;
  caloriesPerDay?: number;
  isVegetarian?: boolean;
  noPork?: boolean;
  lactoseFree?: boolean;
  allergies?: string;
};

/**
 * GET /api/nutrition-profile?userId=...
 * Récupère le profil nutritionnel d'un utilisateur.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est obligatoire" },
        { status: 400 }
      );
    }

    const profile = await prisma.nutritionProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil nutritionnel introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/nutrition-profile :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/nutrition-profile
 * Crée ou met à jour le profil nutritionnel d'un utilisateur.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NutritionProfileInput;

    const {
      userId,
      goal,
      caloriesPerDay,
      isVegetarian,
      noPork,
      lactoseFree,
      allergies,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId est obligatoire" },
        { status: 400 }
      );
    }

    const profile = await prisma.nutritionProfile.upsert({
      where: { userId },
      update: {
        goal,
        caloriesPerDay,
        isVegetarian: isVegetarian ?? false,
        noPork: noPork ?? false,
        lactoseFree: lactoseFree ?? false,
        allergies,
      },
      create: {
        userId,
        goal,
        caloriesPerDay,
        isVegetarian: isVegetarian ?? false,
        noPork: noPork ?? false,
        lactoseFree: lactoseFree ?? false,
        allergies,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Erreur POST /api/nutrition-profile :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/nutrition-profile?userId=...
 * Supprime le profil nutritionnel d'un utilisateur.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est obligatoire" },
        { status: 400 }
      );
    }

    await prisma.nutritionProfile.delete({
      where: { userId },
    });

    return NextResponse.json(
      { message: "Profil nutritionnel supprimé" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur DELETE /api/nutrition-profile :", error);

    // Si aucun profil à supprimer
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Profil nutritionnel introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
