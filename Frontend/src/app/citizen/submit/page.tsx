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

  2. Problem Title & Detailed Description:
     - Input and Textarea fields.

  3. Voice Note Recorder (Audio Input):
     - Record button (MediaRecorder API) to submit verbal description for rural users.

  4. Real-Time AI Suggestion Box:
     - Live classification into 11 domains + severity tag suggestions.

  5. Location:
     - District dropdown & Village / Landmark text (no personal home address needed if anonymous).

  6. Media Upload:
     - Attach photos/documents with preview.

  7. Submission & Passkey Generation Modal:
     - If submitted anonymously, a modal appears with:
       * 🔑 "Your Secret Tracking Key: ANON-JH-984321"
       * "Save this key! You can use it in 'Track Anonymous Problem' to see resolution progress without logging in."
       * "Download Passkey as PDF / Copy to Clipboard" button.
*/
