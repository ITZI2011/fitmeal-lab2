"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white text-2xl">
            🥗
          </div>
          <span className="text-2xl font-bold text-slate-900">FitMeal</span>
        </div>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <li>
            <Link
              href="/"
              className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/meals" className="hover:text-slate-900">
              Repas
            </Link>
          </li>
          <li>
            <Link href="/menu" className="hover:text-slate-900">
              Menu
            </Link>
          </li>
          <li>
            <Link href="/cart" className="hover:text-slate-900">
              Panier
            </Link>
          </li>
          <li>
            <Link href="/orders" className="hover:text-slate-900">
              Mes commandes
            </Link>
          </li>
          <li>
            <Link href="/nutrition-profile" className="hover:text-slate-900">
              Profil nutrition
            </Link>
          </li>
        </ul>

        {/* Connexion / User */}
        <div className="flex items-center gap-4">
          {/* Si l'utilisateur n'est PAS connecté */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600">
                Connexion
              </button>
            </SignInButton>
          </SignedOut>

          {/* Si l'utilisateur EST connecté */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
