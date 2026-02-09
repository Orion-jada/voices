import { getCrossword } from '@/lib/actions';
import CrosswordPlayer from '@/components/CrosswordPlayer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CrosswordPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const crossword = await getCrossword(id);

    if (!crossword) return <div className="container mx-auto px-4 py-8">Crossword not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/games/crossword" className="text-blue-600 hover:text-blue-800">← Back to Crosswords</Link>
            </div>
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">{crossword.title}</h1>
            <CrosswordPlayer data={crossword} />
        </div>
    );
}
