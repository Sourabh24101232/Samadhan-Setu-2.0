// ==========================================
// GOVERNMENT MODULE - ENTRY SERVER FILE
// File: Backend/gov/server.ts
// ==========================================

/*
  PURPOSE:
  - Entry point to run Government Backend microservice / module independently (e.g. PORT 5004).

  WHAT TO IMPLEMENT LATER:
  1. Import express, dotenv, cors.
  2. Import connectDB from './config/db'.
  3. Import govAuthRoutes from './routes/govAuthRoutes'.
  4. Import govProblemRoutes from './routes/govProblemRoutes'.
  5. Import analyticsRoutes from './routes/analyticsRoutes'.
  6. Initialize express app, apply middlewares (cors, express.json).
  7. Mount routes:
     - app.use('/api/gov/auth', govAuthRoutes);
     - app.use('/api/gov/problems', govProblemRoutes);
     - app.use('/api/gov/analytics', analyticsRoutes);
  8. Connect to MongoDB and listen on PORT (e.g., 5004).
*/

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import govAuthRoutes from './routes/govAuthRoutes';
import govProblemRoutes from './routes/govProblemRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/gov/auth', govAuthRoutes);
app.use('/api/gov/problems', govProblemRoutes);
app.use('/api/gov/analytics', analyticsRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Samadhan-Setu Government & State Analytics Microservice',
    status: 'online',
    port: PORT,
    department: 'Department of Higher & Technical Education, Govt of Jharkhand',
    endpoints: {
      auth: '/api/gov/auth',
      problems: '/api/gov/problems',
      analytics: '/api/gov/analytics'
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 [Government Service] Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
