# Guide de configuration Render

## 1. Créer la base PostgreSQL

Dans Render, ajoutez une base PostgreSQL avec les réglages suivants :
- Name: mealplanner-db
- Database: mealplanner
- User: mealplanner
- Plan: Starter

Render créera automatiquement la variable DATABASE_URL.

## 2. Créer le backend

Créer un service Web Node.js avec :
- Name: mealplanner-backend
- Build Command: cd server && npm install && npm run build
- Start Command: cd server && npm start
- Health Check Path: /health

Variables d’environnement :
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<fourni automatiquement par Render>
JWT_ACCESS_SECRET=<valeur longue aléatoire>
JWT_REFRESH_SECRET=<valeur longue aléatoire>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://mealplanner-frontend.onrender.com
APP_URL=https://mealplanner-frontend.onrender.com
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## 3. Créer le frontend

Créer un service Web Static Site avec :
- Name: mealplanner-frontend
- Build Command: npm install && npm run build
- Publish Directory: dist

Variable d’environnement :
```env
VITE_API_URL=https://mealplanner-backend.onrender.com/api
```

## 4. Exécuter les migrations Prisma

Après le déploiement du backend, exécuter :
```bash
cd server
npx prisma migrate deploy
```

Si vous voulez charger les données de démo :
```bash
cd server
npm run seed
```

## 5. Vérifier la connexion d’authentification

L’authentification du frontend est déjà branchée sur l’API via :
- [src/api/client.js](src/api/client.js)
- [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx)

Le frontend envoie les requêtes vers :
```env
VITE_API_URL=http://localhost:4000/api
```

En production, cette variable doit pointer vers l’URL du backend Render.
