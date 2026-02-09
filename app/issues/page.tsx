import { getIssues } from '@/lib/actions';
import Link from 'next/link';

export default async function PublicIssuesPage() {
  const issues = await getIssues();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Archives</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {issues.map(issue => (
          <Link href={`/issues/${issue.id}`} key={issue.id} className="block p-6 bg-white rounded shadow hover:shadow-lg transition border border-blue-100">
            <h2 className="text-2xl font-bold text-black">{issue.month} {issue.year}</h2>
            <p className="text-blue-600 mt-2">View Issue &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
