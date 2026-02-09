import { getAllArticles } from '@/lib/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles = await getAllArticles();
  const recentArticles = articles.slice(0, 3);

  return (
    <div>
      <section className="bg-blue-800 text-white py-20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Masterman Voices</h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-blue-100">The Voice of the Blue Dragons</p>
          <Link href="/issues" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition inline-block">
            Read Latest Issue
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Recent Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentArticles.length > 0 ? recentArticles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border border-blue-100 flex flex-col">
              {article.banner_image && (
                <Link href={`/articles/${article.id}`}>
                  <img src={article.banner_image} alt={article.title} className="w-full h-48 object-cover" />
                </Link>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link href={`/articles/${article.id}`} className="hover:text-blue-600 transition">
                    {article.title}
                  </Link>
                </h3>
                {article.subline && (
                  <p className="text-black text-sm mb-3 line-clamp-2">{article.subline}</p>
                )}
                <p className="text-sm text-blue-500 mb-4">By {article.author || 'Staff'}</p>
                <Link href={`/articles/${article.id}`} className="text-blue-600 font-semibold text-sm uppercase tracking-wide mt-auto">Read More</Link>
              </div>
            </div>
          )) : (
            <p className="text-center col-span-3 text-blue-400">No articles published yet.</p>
          )}
        </div>
      </section>

      <section className="bg-blue-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Challenge Yourself</h2>
          <p className="mb-8 text-black max-w-2xl mx-auto">Test your wits with puzzles, trivia, and word games designed by Masterman students.</p>
          <Link href="/games" className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition shadow-lg inline-block">
            Play Games
          </Link>
        </div>
      </section>
    </div>
  );
}
