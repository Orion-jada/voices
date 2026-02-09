import { getIssues, getCrossword } from '@/lib/actions';
import CrosswordEditor from '@/components/CrosswordEditor';

export const dynamic = 'force-dynamic';

export default async function EditCrosswordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [issues, crossword] = await Promise.all([
    getIssues(),
    getCrossword(id)
  ]);

  if (!crossword) return <div>Crossword not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Crossword</h1>
      <CrosswordEditor issues={issues} initialData={crossword} />
    </div>
  );
}
