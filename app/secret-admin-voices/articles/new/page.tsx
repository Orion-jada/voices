import { getIssues } from '@/lib/actions';
import ArticleForm from '../ArticleForm';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const issues = await getIssues();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Article</h1>
      <ArticleForm issues={issues} />
    </div>
  );
}
