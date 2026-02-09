import { getIssues, getArticle } from '@/lib/actions';
import ArticleForm from '../ArticleForm';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [issues, article] = await Promise.all([
    getIssues(),
    getArticle(id)
  ]);

  if (!article) return <div>Article not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <ArticleForm issues={issues} initialData={article} />
    </div>
  );
}
