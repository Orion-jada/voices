export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow border border-blue-100">
          <h2 className="text-xl font-bold mb-2">Manage Issues</h2>
          <p className="text-black mb-4">Create new monthly issues and publish them.</p>
          <a href="/secret-admin-voices/issues" className="text-blue-600 hover:underline">Go to Issues &rarr;</a>
        </div>
        <div className="bg-white p-6 rounded shadow border border-blue-100">
          <h2 className="text-xl font-bold mb-2">Manage Articles</h2>
          <p className="text-black mb-4">Write, edit, and upload articles.</p>
          <a href="/secret-admin-voices/articles" className="text-blue-600 hover:underline">Go to Articles &rarr;</a>
        </div>
        <div className="bg-white p-6 rounded shadow border border-blue-100">
          <h2 className="text-xl font-bold mb-2">Manage Crosswords</h2>
          <p className="text-black mb-4">Create and edit crossword puzzles.</p>
          <a href="/secret-admin-voices/crosswords" className="text-blue-600 hover:underline">Go to Crosswords &rarr;</a>
        </div>
      </div>
    </div>
  );
}
