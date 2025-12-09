import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white text-lg">
              🥗
            </div>
            <span className="text-lg font-bold">FitMeal</span>
          </div>
          <p className="text-sm text-slate-300">
            Votre partenaire pour une alimentation saine et équilibrée.
            Atteignez vos objectifs fitness avec nos recettes et outils de suivi.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Navigation</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/recipes">Recettes</Link></li>
            <li><Link href="/planner">Planificateur</Link></li>
            <li><Link href="/tracker">Tracker</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Ressources</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Blog</li>
            <li>Guides nutrition</li>
            <li>FAQ</li>
            <li>Support</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Newsletter</h3>
          <p className="mb-3 text-sm text-slate-300">
            Recevez nos meilleures recettes chaque semaine.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              S’inscrire
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2024 FitMeal. Tous droits réservés.
      </div>
    </footer>
  );
}
