"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCart } from "@/components/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">
            Fit<span className="text-emerald-600">Meal</span>
          </span>
          <span role="img" aria-label="target">
            🎯
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/meals"
            className="hover:text-emerald-600 transition-colors"
          >
            Repas
          </Link>

          <Link
            href="/orders"
            className="hover:text-emerald-600 transition-colors"
          >
            Mes commandes
          </Link>

          {/* Panier avec badge */}
          <Link
            href="/cart"
            className="relative inline-flex items-center text-sm hover:text-emerald-600 transition-colors"
          >
            <span>Panier</span>
            {totalItems > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] min-w-[20px] h-[20px] px-1">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-full border px-3 py-1 text-xs hover:bg-slate-100 transition-colors"
            >
              Se connecter
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
