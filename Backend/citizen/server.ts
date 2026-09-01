// ==========================================
// CITIZEN MODULE - ENTRY SERVER FILE
// File: Backend/citizen/server.ts
// ==========================================

/*
  PURPOSE:
  - Entry point to run the Citizen Backend microservice / module independently on its own port (e.g. PORT 5001).

  WHAT TO IMPLEMENT LATER:
  1. Import express, dotenv, cors.
  2. Import connectDB from './config/db'.
  3. Import citizenAuthRoutes from './routes/citizenAuthRoutes'.
  4. Import problemRoutes from './routes/problemRoutes'.
  5. Initialize express app, apply cors(), express.json() middlewares.
  6. Mount routes:
     - app.use('/api/citizen/auth', citizenAuthRoutes);
     - app.use('/api/citizen/problems', problemRoutes);
  7. Connect to MongoDB and start listening on PORT (e.g., 5001).
*/

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import citizenAuthRoutes from './routes/citizenAuthRoutes';
import problemRoutes from './routes/problemRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/citizen/auth', citizenAuthRoutes);
app.use('/api/citizen/problems', problemRoutes);

// Service Root & Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Samadhan-Setu Citizen Microservice',
    status: 'online',
    port: PORT,
    endpoints: {
      auth: '/api/citizen/auth',
      problems: '/api/citizen/problems'
    }
  });
});

// Start Server (Connect to DB first if run directly)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 [Citizen Service] Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
