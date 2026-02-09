import { getAllCrosswords } from '@/lib/actions';
import Link from 'next/link';

export default async function CrosswordsListPage() {
  const crosswords = await getAllCrosswords();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crosswords</h1>
        <Link href="/secret-admin-voices/crosswords/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Crossword
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden border border-blue-100">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {crosswords.map((cw) => (
              <tr key={cw.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-black">{cw.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">{new Date(cw.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                  <Link href={`/secret-admin-voices/crosswords/${cw.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
