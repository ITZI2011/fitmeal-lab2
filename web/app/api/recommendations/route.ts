// app/api/recommendations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const profile = await prisma.nutritionProfile.findUnique({
      where: { userId },
    });

    const meals = await prisma.meal.findMany({
      orderBy: { price: "asc" },
    });

    if (!profile || !profile.caloriesPerDay) {
      // pas de profil : on renvoie juste quelques meals
      return NextResponse.json(
        {
          recommendations: meals.slice(0, 5),
          note: "Profil incomplet : recommandations génériques.",
        },
        { status: 200 }
      );
    }

    const targetPerMeal = profile.caloriesPerDay * 0.3; // ex: 30% des calories par repas

    const scored = meals
      .map((meal) => {
        const cals = (meal as any).calories ?? 0;
        const score = Math.abs(cals - targetPerMeal);
        return { meal, score };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map((x) => x.meal);

    return NextResponse.json(
      {
        recommendations: scored,
        note: "Recommandations basées sur l'objectif calorique.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Erreur lors des recommandations" },
      { status: 500 }
    );
  }
}
