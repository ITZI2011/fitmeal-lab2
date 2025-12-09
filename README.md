# 🥗 FitMeal – Application Transactionnelle  
### Projet Final – Développement Web Transactionnel

---

## 1. Description du projet

FitMeal est une application Web transactionnelle permettant aux utilisateurs de consulter un catalogue de repas, ajouter des repas au panier, passer une commande, suivre l’évolution et le statut de leurs commandes, gérer leur profil nutritionnel (calories et macros), voir l’impact de leurs choix alimentaires sur leur profil nutrition, s’authentifier de manière sécurisée via Clerk et, de façon optionnelle, effectuer un paiement via Stripe.

L’application repose sur une architecture moderne basée sur Next.js, Prisma et PostgreSQL afin d’assurer performance, sécurité et maintenabilité.

---

## 2. Technologies utilisées

Frontend  
- Next.js 16 (App Router + Turbopack)  
- React  
- TypeScript  
- TailwindCSS  
- Clerk Auth  

Backend  
- Next.js API Routes  
- Prisma ORM  
- PostgreSQL (Neon)  

Outils de développement  
- Git & GitHub  
- ESLint & Prettier  
- Prisma Studio  

---

## 3. Installation et exécution

```bash
# 1) Cloner le projet
git clone https://github.com/ITZI2011/fitmeal-lab2.git
cd fitmeal-lab2

# 2) Installer les dépendances
npm install

# 3) Créer le fichier .env et configurer les variables
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key   # optionnel

# 4) Générer Prisma Client
npx prisma generate

# 5) Appliquer les migrations
npx prisma migrate dev

# 6) (Optionnel) Lancer Prisma Studio
npx prisma studio

# 7) Démarrer l’application
npm run dev
```
---
## 4. Compte de test

Email : test@example.com

Mot de passe : Test1234!
---
## 5. Équipe & rôles

# Imane Touraity – Développeur Full-Stack

# Responsabilités :

Conception de la base de données

Développement frontend (Next.js)

Développement des API Meals & Orders

Intégration Clerk

Gestion du panier (CartContext)

Profil nutritionnel

Debug et optimisation

Bonus : intégration Stripe
---
## 6. Structure du projet
```bash
app/
├── meals/ Affichage et gestion des repas
├── orders/ Gestion des commandes
├── nutrition/ Calculs nutritionnels
├── nutrition-profile/ Impact des repas sur le profil nutrition
├── api/
│ ├── meals/ API CRUD Meals
│ ├── orders/ API CRUD Orders
│ └── ...
components/ Composants UI
hooks/ CartContext
lib/prisma.ts Client Prisma
prisma/schema.prisma Schéma de la base de données
README.md

```
---
## 7. Fonctionnalités

Authentification (Clerk)

Login, Register, Logout

Sessions sécurisées

Protection des routes

Gestion des repas (Meals)

Consultation

Ajout

Édition

Suppression

Panier (CartContext)

Ajouter / Retirer un repas

Modifier la quantité

Calcul automatique du total

Commandes (Orders)

Création d’une commande

Stockage en base de données

Mise à jour du statut :

PENDING

PAID

CANCELLED

Profil nutrition

Objectifs nutritionnels

Calories et macros consommées vs cibles

Analyse d’impact “Voir l’impact sur mon profil nutrition”

Backend via API Next.js

POST /api/meals

GET /api/meals

POST /api/orders

GET /api/orders

PATCH /api/orders/:id
---
**## 8. Bonus**

Paiement Stripe

Dashboard administrateur

Gestion de rôles (ADMIN / USER)

Statistiques de commandes
---
## 9. Licence

Projet académique – Développement Web Transactionnel
