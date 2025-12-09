// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  mealId: string;
  quantity?: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ⚠️ ICI userId = ID CLERK envoyé par le front
    const { userId: clerkUserId, items } = body as {
      userId?: string;
      items?: OrderItemInput[];
    };

    if (!clerkUserId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "userId (Clerk) et au moins un item sont obligatoires" },
        { status: 400 }
      );
    }

    // 1) Trouver ou créer l'utilisateur local en fonction de clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      // on n'a pas l'email de Clerk côté API,
      // donc on met un email bidon unique basé sur l'id Clerk
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: `${clerkUserId}@example.com`,
          name: null,
        },
      });
    }

    // 2) Vérifier que tous les meals existent et récupérer leur prix
    const mealIds = items.map((i) => i.mealId);
    const meals = await prisma.meal.findMany({
      where: { id: { in: mealIds } },
    });

    if (meals.length !== items.length) {
      return NextResponse.json(
        { error: "Certains repas n'existent pas." },
        { status: 400 }
      );
    }

    // Map des prix par mealId
    const priceByMealId = new Map<string, number>();
    for (const meal of meals) {
      priceByMealId.set(meal.id, meal.price);
    }

    // 3) Calcul du total de la commande
    let total = 0;
    const orderItemsData = items.map((item) => {
      const quantity = item.quantity ?? 1;
      const unitPrice = priceByMealId.get(item.mealId) ?? 0;
      total += unitPrice * quantity;

      return {
        mealId: item.mealId,
        quantity,
        unitPrice,
      };
    });

    // 4) Création de la commande
    const order = await prisma.order.create({
      data: {
        userId: user.id, // ✅ on met l'ID de la table User, pas l'id Clerk
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            meal: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    return NextResponse.json(
      { error: "Erreur interne serveur lors de la création de la commande." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            meal: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    return NextResponse.json(
      { error: "Erreur interne serveur lors de la récupération des commandes." },
      { status: 500 }
    );
  }
}
