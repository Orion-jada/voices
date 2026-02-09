import { getArticle, getIssue, getAllArticles } from '@/lib/actions';
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) return <div>Article not found</div>;

  const issue = article.issue_id ? await getIssue(article.issue_id) : null;

  // Get suggested articles (excluding current article)
  const allArticles = await getAllArticles();
  const suggestedArticles = allArticles
    .filter(a => a.id !== id)
    .slice(0, 5);

  return (
    <div>
      {article.banner_image && (
        <div className="w-full h-64 md:h-96 relative mb-8">
          <img
            src={article.banner_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar - Suggested Articles */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-100 pb-2">More Stories</h3>
              <div className="space-y-4">
                {suggestedArticles.slice(0, 3).map(a => (
                  <Link key={a.id} href={`/articles/${a.id}`} className="block group">
                    {a.banner_image && (
                      <img src={a.banner_image} alt={a.title} className="w-full h-24 object-cover rounded mb-2" />
                    )}
                    <h4 className="text-sm font-semibold text-black group-hover:text-blue-600 transition line-clamp-2">{a.title}</h4>
                    <p className="text-xs text-blue-500 mt-1">By {a.author || 'Staff'}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Article Content */}
          <article className="flex-1 max-w-3xl">
            <div className="text-center mb-8">
              {issue && <p className="text-blue-500 uppercase tracking-widest text-sm mb-2">{issue.month} {issue.year}</p>}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black leading-tight">{article.title}</h1>
              {article.subline && <p className="text-xl text-black mb-4">{article.subline}</p>}
              <p className="text-xl text-blue-800 font-serif italic">By {article.author || 'Staff'}</p>
            </div>

            <div className="prose prose-lg mx-auto text-black font-serif max-w-none break-words [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          {/* Right Sidebar - More Suggested Articles */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-100 pb-2">Keep Reading</h3>
              <div className="space-y-4">
                {suggestedArticles.slice(3, 5).map(a => (
                  <Link key={a.id} href={`/articles/${a.id}`} className="block group">
                    {a.banner_image && (
                      <img src={a.banner_image} alt={a.title} className="w-full h-24 object-cover rounded mb-2" />
                    )}
                    <h4 className="text-sm font-semibold text-black group-hover:text-blue-600 transition line-clamp-2">{a.title}</h4>
                    <p className="text-xs text-blue-500 mt-1">By {a.author || 'Staff'}</p>
                  </Link>
                ))}
              </div>

              <Link href="/issues" className="block mt-6 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm font-semibold">
                View All Issues →
              </Link>
            </div>
          </aside>
        </div>

        {/* Mobile Suggested Articles */}
        <div className="lg:hidden mt-12 border-t border-blue-100 pt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">More Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedArticles.slice(0, 4).map(a => (
              <Link key={a.id} href={`/articles/${a.id}`} className="block group flex gap-4">
                {a.banner_image && (
                  <img src={a.banner_image} alt={a.title} className="w-24 h-24 object-cover rounded flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-black group-hover:text-blue-600 transition line-clamp-2">{a.title}</h4>
                  <p className="text-xs text-blue-500 mt-1">By {a.author || 'Staff'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
