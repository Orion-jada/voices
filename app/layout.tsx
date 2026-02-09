import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Masterman Voices',
  description: 'The Official Newspaper of Julia R. Masterman School',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white text-black`}>
        <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-serif font-bold tracking-wider">
              MASTERMAN VOICES
            </Link>
            <nav className="hidden md:flex space-x-6 font-semibold">
              <Link href="/" className="hover:text-blue-200 transition">Home</Link>
              <Link href="/issues" className="hover:text-blue-200 transition">Issues</Link>
              <Link href="/games" className="hover:text-blue-200 transition">Games</Link>
              <Link href="/contacts" className="hover:text-blue-200 transition">Contact</Link>
            </nav>
            {/* Simple mobile menu link for now */}
            <Link href="/issues" className="md:hidden text-white font-bold">Menu</Link>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-blue-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Masterman Voices. Home of the Blue Dragons.</p>
            <p className="text-sm mt-2 text-blue-200">Julia R. Masterman School, Philadelphia</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
