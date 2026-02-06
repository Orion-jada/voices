import { getIssues } from '@/lib/actions';
import CrosswordEditor from '@/components/CrosswordEditor';

export default async function NewCrosswordPage() {
  const issues = await getIssues();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Crossword</h1>
      <CrosswordEditor issues={issues} />
    </div>
  );
}
