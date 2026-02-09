import { getCrossword } from '@/lib/actions';
import CrosswordPlayer from '@/components/CrosswordPlayer';

export const dynamic = 'force-dynamic';

export default async function CrosswordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crossword = await getCrossword(id);

  if (!crossword) return <div>Crossword not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{crossword.title}</h1>
      <CrosswordPlayer data={crossword} />
    </div>
  );
}
