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
