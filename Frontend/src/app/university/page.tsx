// ==========================================
// UNIVERSITY PORTAL - ROUTED CHALLENGES DASHBOARD
// File: Frontend/src/app/university/page.tsx
// ==========================================

/*
  PURPOSE:
  - Higher Education Institution (HEI) workspace where faculty mentors and student innovators browse challenges routed by AI, filter by department discipline, and claim problems.

  FEATURES TO IMPLEMENT LATER:
  1. HEI Header Profile:
     - Institution Name (e.g., "BIT Mesra", "IIT ISM Dhanbad", "Birsa Agricultural University")
     - Department & Active Student Teams count.
  2. Routed Problems Feed:
     - Fetches challenges routed to this institution domain (`GET /api/university/problems/routed`).
     - Filter tabs: All Assigned, High Severity, Water Resources, Agriculture, IoT & Sensors.
  3. Action Modals:
     - "Claim Problem": Assigns problem to team and locks for 14 days to submit proposal.
     - "Quick AI Solution Brainstormer": AI-generated research angles and potential multidisciplinary approaches.
*/
