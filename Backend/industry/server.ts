// ==========================================
// INDUSTRY MODULE - ENTRY SERVER FILE
// File: Backend/industry/server.ts
// ==========================================

/*
  PURPOSE:
  - Entry point to run Industry Backend microservice / module independently (e.g. PORT 5003).

  WHAT TO IMPLEMENT LATER:
  1. Import express, dotenv, cors.
  2. Import connectDB from './config/db'.
  3. Import industryAuthRoutes from './routes/industryAuthRoutes'.
  4. Import partnershipRoutes from './routes/partnershipRoutes'.
  5. Initialize express app, apply middlewares (cors, express.json).
  6. Mount routes:
     - app.use('/api/industry/auth', industryAuthRoutes);
     - app.use('/api/industry/partnerships', partnershipRoutes);
  7. Connect to MongoDB and listen on PORT (e.g., 5003).
*/

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import industryAuthRoutes from './routes/industryAuthRoutes';
import partnershipRoutes from './routes/partnershipRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/industry/auth', industryAuthRoutes);
app.use('/api/industry/partnerships', partnershipRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Samadhan-Setu Industry & CSR Microservice',
    status: 'online',
    port: PORT,
    endpoints: {
      auth: '/api/industry/auth',
      partnerships: '/api/industry/partnerships'
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 [Industry Service] Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
