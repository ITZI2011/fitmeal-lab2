import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white flex flex-col">
      <Navbar />

      {/* Contenu principal */}
      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:items-center">
          {/* Colonne gauche : texte */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700">
              <span>⚡</span>
              <span>Nutrition intelligente</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Transformez <br />
              votre <span className="text-emerald-500">alimentation</span>
            </h1>

            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Planifiez vos repas, suivez vos macros et atteignez vos objectifs fitness
              avec FitMeal. Des milliers de recettes saines à portée de main.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600">
                Planifier mes repas
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300">
                Découvrir les recettes
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 text-sm text-slate-600">
              <span>✅</span>
              <span>Plus de 2000 recettes saines</span>
            </div>
          </div>

          {/* Colonne droite : cartes stats */}
          <div className="flex-1">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Carte 1 */}
              <div className="rounded-3xl bg-white p-5 shadow-lg shadow-emerald-100">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  ❤
                </div>
                <h3 className="mb-1 text-base font-semibold text-slate-900">
                  Santé optimale
                </h3>
                <p className="text-sm text-slate-600">
                  Alimentation équilibrée pour votre bien-être.
                </p>
              </div>

              {/* Carte 2 */}
              <div className="rounded-3xl bg-gradient-to-br from-orange-400 to-pink-500 p-5 text-white shadow-lg">
                <h3 className="text-3xl font-extrabold">500k+</h3>
                <p className="mt-1 text-sm font-medium">Utilisateurs actifs</p>
              </div>

              {/* Carte 3 */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
                <h3 className="text-3xl font-extrabold">2000+</h3>
                <p className="mt-1 text-sm font-medium">Recettes disponibles</p>
              </div>

              {/* Carte 4 */}
              <div className="rounded-3xl bg-white p-5 shadow-lg shadow-emerald-100">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  🏆
                </div>
                <h3 className="mb-1 text-base font-semibold text-slate-900">
                  Objectifs atteints
                </h3>
                <p className="text-sm text-slate-600">
                  Résultats mesurables, semaine après semaine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bande de stats en bas comme sur ta capture */}
        <section className="border-y bg-emerald-50/70">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <span>✅</span> <span>Plus de 2000 recettes saines</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <span>✅</span> <span>Suivi nutritionnel personnalisé</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <span>✅</span> <span>Plans de repas sur mesure</span>
              </p>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-4">
              <Stat number="2000+" label="Recettes" />
              <Stat number="500k+" label="Utilisateurs" />
              <Stat number="98%" label="Satisfaction" />
              <Stat number="4.9★" label="Note moyenne" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

type StatProps = {
  number: string;
  label: string;
};

function Stat({ number, label }: StatProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold text-slate-900">{number}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}
