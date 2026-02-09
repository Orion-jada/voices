import { createIssue, getIssues } from '@/lib/actions';

export default async function IssuesPage() {
  const issues = await getIssues();

  async function addIssue(formData: FormData) {
    'use server';
    await createIssue(formData.get('month') as string, Number(formData.get('year')));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Issues</h1>

      <form action={addIssue} className="bg-white p-4 rounded shadow mb-8 flex gap-4 items-end">
        <div>
          <label className="block text-sm">Month</label>
          <input name="month" type="text" placeholder="e.g. October" className="border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm">Year</label>
          <input name="year" type="number" defaultValue={new Date().getFullYear()} className="border p-2 rounded" required />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Issue</button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden border border-blue-100">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Published</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td className="px-6 py-4 whitespace-nowrap text-black">{issue.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black">{issue.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black">{issue.is_published ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
