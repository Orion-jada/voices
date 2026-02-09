import { getIssue, getArticles } from '@/lib/actions';
import Link from 'next/link';

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getIssue(id);
  const articles = await getArticles(id);

  if (!issue) return <div>Issue not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-2 text-center text-blue-900">{issue.month} {issue.year}</h1>
      <p className="text-center text-blue-500 mb-12 uppercase tracking-widest">Masterman Voices</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {articles.map(article => (
          <article key={article.id} className="border-b border-blue-100 pb-8">
            {article.banner_image && (
              <Link href={`/articles/${article.id}`} className="block mb-4">
                <img src={article.banner_image} alt={article.title} className="w-full h-48 object-cover rounded" />
              </Link>
            )}
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-3xl font-bold mb-2 hover:text-blue-700 transition">{article.title}</h2>
            </Link>
            {article.subline && (
              <p className="text-black mb-4 text-lg">{article.subline}</p>
            )}
            <p className="text-blue-800 font-serif italic">By {article.author || 'Staff'}</p>
            <Link href={`/articles/${article.id}`} className="text-blue-600 mt-2 inline-block font-semibold">Read More &rarr;</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
