'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseDocx } from '@/lib/file-actions';
import { createArticle, updateArticle } from '@/lib/actions';
import { Issue, Article } from '@/lib/types';
import Editor from '@/components/Editor';

export default function ArticleForm({ issues, initialData }: { issues: Issue[], initialData?: Article }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [issueId, setIssueId] = useState(initialData?.issue_id || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const html = await parseDocx(formData);
      setContent(html);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await updateArticle(initialData.id, { title, author, issue_id: issueId, content });
      } else {
        await createArticle({ title, author, issue_id: issueId, content });
      }
      router.push('/secret-admin-voices/articles');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Author</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Issue</label>
        <select value={issueId} onChange={(e) => setIssueId(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Select Issue</option>
          {issues.map(i => (
            <option key={i.id} value={i.id}>{i.month} {i.year}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Import from Word (.docx)</label>
        <input type="file" accept=".docx" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <Editor value={content} onChange={setContent} />
      </div>

      <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        {loading ? 'Saving...' : 'Save Article'}
      </button>
    </form>
  );
}
