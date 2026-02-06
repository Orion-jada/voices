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
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-slate-800 text-white flex-shrink-0 hidden md:block">
        <div className="p-4 text-xl font-bold">Voices Admin</div>
        <nav className="mt-4">
          <Link href="/secret-admin-voices" className={`block py-2 px-4 hover:bg-slate-700 ${pathname === '/secret-admin-voices' ? 'bg-slate-700' : ''}`}>Dashboard</Link>
          <Link href="/secret-admin-voices/articles" className={`block py-2 px-4 hover:bg-slate-700 ${pathname.startsWith('/secret-admin-voices/articles') ? 'bg-slate-700' : ''}`}>Articles</Link>
          <Link href="/secret-admin-voices/issues" className={`block py-2 px-4 hover:bg-slate-700 ${pathname.startsWith('/secret-admin-voices/issues') ? 'bg-slate-700' : ''}`}>Issues</Link>
          <Link href="/secret-admin-voices/crosswords" className={`block py-2 px-4 hover:bg-slate-700 ${pathname.startsWith('/secret-admin-voices/crosswords') ? 'bg-slate-700' : ''}`}>Crosswords</Link>
        </nav>
        <div className="p-4 border-t border-slate-700 mt-auto">
             <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
