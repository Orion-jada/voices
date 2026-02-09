import { getAllCrosswords } from '@/lib/actions';
import Link from 'next/link';

export default async function PublicCrosswordsPage() {
  const crosswords = await getAllCrosswords();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Crosswords</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crosswords.map(cw => (
          <Link href={`/crosswords/${cw.id}`} key={cw.id} className="block p-6 bg-white rounded shadow hover:shadow-lg transition border border-blue-100 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">{cw.title}</h2>
            <p className="text-blue-500">{new Date(cw.created_at).toLocaleDateString()}</p>
            <span className="inline-block mt-4 text-blue-600 font-semibold">Play Now &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
