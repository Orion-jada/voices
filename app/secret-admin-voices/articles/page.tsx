import { getAllArticles, getIssues } from '@/lib/actions';
import Link from 'next/link';

export default async function ArticlesListPage() {
  const articles = await getAllArticles();
  const issues = await getIssues();

  const getIssueName = (id: string | null) => {
    if (!id) return 'Unassigned';
    const issue = issues.find(i => i.id === id);
    return issue ? `${issue.month} ${issue.year}` : 'Unknown';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/secret-admin-voices/articles/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Article
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{article.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{article.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{getIssueName(article.issue_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                  <Link href={`/secret-admin-voices/articles/${article.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
