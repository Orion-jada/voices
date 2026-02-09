'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/secret-admin-voices/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/secret-admin-voices/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-4 text-xl font-bold">Voices Admin</div>
        <nav className="mt-4">
          <Link href="/secret-admin-voices" className={`block py-2 px-4 hover:bg-blue-800 ${pathname === '/secret-admin-voices' ? 'bg-blue-800' : ''}`}>Dashboard</Link>
          <Link href="/secret-admin-voices/articles" className={`block py-2 px-4 hover:bg-blue-800 ${pathname.startsWith('/secret-admin-voices/articles') ? 'bg-blue-800' : ''}`}>Articles</Link>
          <Link href="/secret-admin-voices/issues" className={`block py-2 px-4 hover:bg-blue-800 ${pathname.startsWith('/secret-admin-voices/issues') ? 'bg-blue-800' : ''}`}>Issues</Link>
          <div className="py-2 px-4 text-blue-300 text-xs uppercase tracking-wider mt-4">Games</div>
          <Link href="/secret-admin-voices/crosswords" className={`block py-2 px-4 hover:bg-blue-800 ${pathname.startsWith('/secret-admin-voices/crosswords') ? 'bg-blue-800' : ''}`}>Crosswords</Link>
          <Link href="/secret-admin-voices/trivia" className={`block py-2 px-4 hover:bg-blue-800 ${pathname.startsWith('/secret-admin-voices/trivia') ? 'bg-blue-800' : ''}`}>Trivia</Link>
          <Link href="/secret-admin-voices/vocab" className={`block py-2 px-4 hover:bg-blue-800 ${pathname.startsWith('/secret-admin-voices/vocab') ? 'bg-blue-800' : ''}`}>Vocab Match</Link>
          <Link href="/secret-admin-voices/word-ladder" className={`block py-2 px-4 hover:bg-blue-800 ${pathname.startsWith('/secret-admin-voices/word-ladder') ? 'bg-blue-800' : ''}`}>Word Ladder</Link>
        </nav>
        <div className="p-4 border-t border-blue-800 mt-auto">
          <button onClick={handleLogout} className="text-sm text-blue-200 hover:text-white">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
