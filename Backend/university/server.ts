// ==========================================
// UNIVERSITY MODULE - ENTRY SERVER FILE
// File: Backend/university/server.ts
// ==========================================

/*
  PURPOSE:
  - Entry point to run University Backend microservice / module independently (e.g. PORT 5002).

  WHAT TO IMPLEMENT LATER:
  1. Import express, dotenv, cors.
  2. Import connectDB from './config/db'.
  3. Import universityAuthRoutes from './routes/universityAuthRoutes'.
  4. Import universityProblemRoutes from './routes/universityProblemRoutes'.
  5. Import proposalRoutes from './routes/proposalRoutes'.
  6. Initialize express app, apply middlewares (cors, express.json).
  7. Mount routes:
     - app.use('/api/university/auth', universityAuthRoutes);
     - app.use('/api/university/problems', universityProblemRoutes);
     - app.use('/api/university/proposals', proposalRoutes);
  8. Connect to MongoDB and listen on PORT (e.g., 5002).
*/

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import universityAuthRoutes from './routes/universityAuthRoutes';
import universityProblemRoutes from './routes/universityProblemRoutes';
import proposalRoutes from './routes/proposalRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/university/auth', universityAuthRoutes);
app.use('/api/university/problems', universityProblemRoutes);
app.use('/api/university/proposals', proposalRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Samadhan-Setu University & HEI Microservice',
    status: 'online',
    port: PORT,
    endpoints: {
      auth: '/api/university/auth',
      problems: '/api/university/problems',
      proposals: '/api/university/proposals'
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 [University Service] Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
