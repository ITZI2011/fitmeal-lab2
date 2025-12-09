// app/api/meals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/meals : liste de tous les meals
export async function GET() {
  try {
    const meals = await prisma.meal.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(meals, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/meals :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des meals." },
      { status: 500 }
    );
  }
}

// POST /api/meals : créer un nouveau meal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, calories, isVegan } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Le nom et le prix sont obligatoires." },
        { status: 400 }
      );
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        description: description ?? "",
        price: Number(price),
        calories: calories !== undefined ? Number(calories) : null,
        isVegan: Boolean(isVegan),
      },
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/meals :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du meal." },
      { status: 500 }
    );
  }
}
