import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LegalEase AI - Legal Document Translator',
  description: 'Convert legal documents to plain English and vice versa using AI. Professional legal document translation made simple.',
  keywords: 'legal, translation, AI, documents, plain English, legal tech, contracts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
