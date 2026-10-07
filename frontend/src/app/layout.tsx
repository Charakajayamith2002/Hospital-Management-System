import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ApexCare HMS — Hospital Management System',
  description: 'Enterprise Hospital Management System with Real-Time Clinical Operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}

