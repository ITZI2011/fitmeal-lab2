'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMealForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [isVegan, setIsVegan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          price: Number(price),
          calories: calories ? Number(calories) : null,
          isVegan,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Erreur lors de la création du repas');
        return;
      }

      // Reset du formulaire
      setName('');
      setDescription('');
      setPrice('');
      setCalories('');
      setIsVegan(false);

      // Rafraîchir la page côté serveur pour voir le nouveau repas
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mb-8 bg-white shadow p-4 rounded-lg space-y-4"
    >
      <h2 className="text-xl font-semibold">Ajouter un nouveau repas</h2>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nom du repas *</label>
        <input
          className="border rounded px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="border rounded px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Prix ($) *</label>
          <input
            type="number"
            step="0.01"
            className="border rounded px-3 py-2 text-sm"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Calories (kcal)</label>
          <input
            type="number"
            className="border rounded px-3 py-2 text-sm"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input
            id="isVegan"
            type="checkbox"
            checked={isVegan}
            onChange={(e) => setIsVegan(e.target.checked)}
          />
          <label htmlFor="isVegan" className="text-sm">
            Repas vegan
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'En cours...' : 'Créer le repas'}
      </button>
    </form>
  );
}
