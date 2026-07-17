# mealplanner-app

Meal planner app built with React, Vite, Express, Prisma, and PostgreSQL. Includes authentication, recipe management, meal planning, and newsletter features.

## Overview

This project is a full-stack meal planner built with:
- Frontend: React + Vite
- Backend: Express + Prisma + PostgreSQL
- Auth: JWT access and refresh tokens
- Email: Resend
- Deployment: Render

## Local development

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

### Database
```bash
cd server
npx prisma migrate dev --name init
npm run seed
```

## Render deployment

See the deployment guide in [docs/render-setup-guide.md](docs/render-setup-guide.md).

## API overview

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/recipes
- GET /api/recipes/:id
- GET /api/meal-plan
- POST /api/meal-plan
- DELETE /api/meal-plan/:id
- POST /api/subscribers
