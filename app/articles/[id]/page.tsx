import { getArticle, getIssue } from '@/lib/actions';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) return <div>Article not found</div>;
  
  const issue = article.issue_id ? await getIssue(article.issue_id) : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
         {issue && <p className="text-gray-500 uppercase tracking-widest text-sm mb-2">{issue.month} {issue.year}</p>}
         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">{article.title}</h1>
         <p className="text-xl text-gray-600 font-serif italic">By {article.author || 'Staff'}</p>
      </div>
      
      <div className="prose prose-lg mx-auto text-gray-800 font-serif" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
