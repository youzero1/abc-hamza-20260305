'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { IPost, UpdatePostDto } from '@/types';
import Link from 'next/link';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) {
        setPost(null);
        return;
      }
      const json = await res.json();
      setPost(json.data || json);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (formData: UpdatePostDto) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to update post');
        return;
      }
      router.push(`/posts/${id}`);
    } catch {
      setError('Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4 w-1/2" />
          <div className="h-12 bg-slate-100 rounded mb-4" />
          <div className="h-48 bg-slate-100 rounded mb-4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Post not found</h2>
        <Link href="/posts" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href={`/posts/${id}`} className="text-slate-400 hover:text-slate-600 transition-colors">← Back to post</Link>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Edit Post</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <PostForm
        onSubmit={handleSubmit}
        loading={saving}
        initialData={{
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          coverImage: post.coverImage || '',
          published: post.published,
        }}
        isEdit
      />
    </div>
  );
}
