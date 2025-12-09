// web/lib/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY n'est pas défini dans .env");
}

// On ne met PAS de config avec apiVersion pour éviter les erreurs TS
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
