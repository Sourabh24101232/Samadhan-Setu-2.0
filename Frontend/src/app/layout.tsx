// ==========================================
// FRONTEND - ROOT LAYOUT
// File: Frontend/src/app/layout.tsx
// ==========================================

/*
  PURPOSE:
  - Root layout rendering global fonts, Navbar, dynamic breadcrumbs, and Footer for all routes.

  COMPONENTS TO INCLUDE:
  - <Navbar />
  - {children}
  - <Footer />
*/

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Samadhan-Setu | Jharkhand Societal Innovation & HEI Research Bridge',
  description:
    'Bridging grassroots societal challenges in Jharkhand with academic R&D institutions and industry CSR funding under NEP 2020 experiential learning. SIH26043.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
