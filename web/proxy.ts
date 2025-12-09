// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Quelles routes sont protégées / gérées par Clerk
export const config = {
  matcher: [
    // Gère toutes les routes "app" sauf les fichiers statiques et _next
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
