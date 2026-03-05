'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { IUser, CreatePostDto } from '@/types';

export default function NewPostPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        const userList = data.data || data || [];
        setUsers(userList);
        if (userList.length > 0) setSelectedUserId(userList[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (formData: Omit<CreatePostDto, 'authorId'>) => {
    if (!selectedUserId) {
      setError('Please select an author.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, authorId: selectedUserId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to create post');
        return;
      }
      router.push(`/posts/${json.data?.id || json.id}`);
    } catch {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Post</h1>
        <p className="text-slate-500">Share your thoughts with the world</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Author Selection */}
      {users.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Author</label>
          <select
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
