// ==========================================
// CITIZEN PORTAL - PROBLEM SUBMISSION (WITH ANONYMOUS WHISTLEBLOWER TOGGLE)
// File: Frontend/src/app/citizen/submit/page.tsx
// ==========================================

/*
  PURPOSE:
  - Submission form with full Anonymous Whistleblower shield, photo/video/voice note uploads, and AI auto-categorization.

  FORM CONTROLS TO IMPLEMENT LATER:
  
  1. 🛡️ ANONYMOUS WHISTLEBLOWER TOGGLE:
     - Toggle switch: "Submit Anonymously (Whistleblower Mode)"
     - Subtitle: "Your name, phone number, and IP address will NOT be saved. You will receive a Secret Tracking Key to check progress safely."
     - Media EXIF stripper utility automatically scrubs camera/GPS hardware identifiers from photos before upload.

  2. Problem Title & Detailed Description.
  3. Voice Note Recorder (Audio Input for rural users).
  4. Real-Time AI Suggestion Box (11 domains + severity tag suggestions).
  5. Location: District dropdown & Village / Landmark text.
  6. Media Upload: Photos/Documents preview.
  7. Submission & Passkey Modal (Displays secret passkey `ANON-JH-XXXXXX` for anonymous reporters).
*/
