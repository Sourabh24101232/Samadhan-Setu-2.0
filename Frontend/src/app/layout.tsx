// ==========================================
// FRONTEND - ROOT LAYOUT BLUEPRINT
// File: Frontend/src/app/layout.tsx
// ==========================================

/*
  PURPOSE:
  - Root Layout wrapping all pages with global HTML structure, Inter font, Navbar, Footer, and Toast notification providers.

  WHAT TO IMPLEMENT LATER:
  1. Import type Metadata from 'next'.
  2. Import Inter font from 'next/font/google'.
  3. Import './globals.css'.
  4. Import Navbar component from '@/components/Navbar'.
  5. Import Footer component from '@/components/Footer'.
  6. Define Metadata:
     - title: 'Samadhan-Setu | Jharkhand Societal Innovation Platform'
     - description: 'Crowdsourcing societal challenges & enabling university-industry collaborative problem solving'
  7. Render:
     <html lang="en">
       <body className={inter.className}>
         <Navbar />
         <main className="min-h-[85vh]">{children}</main>
         <Footer />
       </body>
     </html>
*/
