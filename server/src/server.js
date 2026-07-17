import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { execSync } from 'child_process';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import { env } from './config/env.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigin.split(','), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'mealplanner-backend' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || env.port || 4000;

const initializeDatabase = () => {
  if (!env.databaseUrl) {
    console.warn('DATABASE_URL not set; skipping database initialization.');
    return;
  }

  try {
    const cwd = path.resolve(process.cwd(), 'server');
    execSync('npx prisma migrate deploy', { cwd, stdio: 'inherit' });
    execSync('node prisma/seed.js', { cwd, stdio: 'inherit' });
  } catch (error) {
    console.warn('Database initialization skipped or failed:', error.message);
  }
};

initializeDatabase();

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
