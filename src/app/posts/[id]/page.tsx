'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';
import { IPost } from '@/types';

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderContent(content: string) {
  // Simple markdown-like rendering
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold my-4">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold my-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold my-2">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc my-1">{line.slice(2)}</li>;
    if (line.trim() === '') return <br key={i} />;
    // Handle **bold** and *italic*
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="my-2 leading-relaxed">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    );
  });
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) {
        setPost(null);
        return;
      }
      const json = await res.json();
      const postData = json.data || json;
      setPost(postData);
      setLikeCount(postData.likes || 0);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (liked || !post) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: likeCount + 1 }),
      });
    } catch {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/posts');
      }
    } catch {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4 w-3/4" />
          <div className="h-4 bg-slate-100 rounded mb-2" />
          <div className="h-4 bg-slate-100 rounded mb-2 w-5/6" />
          <div className="h-64 bg-slate-200 rounded mt-6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Post not found</h2>
        <p className="text-slate-400 mb-6">This post may have been deleted or doesn't exist.</p>
        <Link href="/posts" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/posts" className="hover:text-blue-600 transition-colors">Posts</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600 truncate">{post.title}</span>
      </nav>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-72 rounded-2xl overflow-hidden mb-8 shadow-md">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {post.published ? (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Published</span>
          ) : (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">Draft</span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-slate-500 mb-4 leading-relaxed">{post.excerpt}</p>
        )}

        {/* Author and Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {post.author?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="font-semibold text-slate-800">
                {post.author ? (
                  <Link href={`/profile?userId=${post.author.id}`} className="hover:text-blue-600 transition-colors">
                    {post.author.username}
                  </Link>
                ) : 'Anonymous'}
              </div>
              <div className="text-sm text-slate-400">{formatDate(post.createdAt)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                liked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
              }`}
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span className="font-medium">{likeCount}</span>
            </button>
            <Link
              href={`/posts/${id}/edit`}
              className="px-4 py-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors text-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-10 text-slate-700">
        {renderContent(post.content)}
      </article>

      {/* Comment Section */}
      <CommentSection postId={Number(id)} />
    </div>
  );
}
