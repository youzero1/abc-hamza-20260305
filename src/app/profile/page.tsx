'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { IUser, IPost } from '@/types';
import { Suspense } from 'react';

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      const userList: IUser[] = json.data || json || [];
      setUsers(userList);
      if (userId) {
        const found = userList.find((u) => String(u.id) === userId);
        setSelectedUser(found || userList[0] || null);
      } else {
        setSelectedUser(userList[0] || null);
      }
    } catch {
      setUsers([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchPosts = useCallback(async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/posts?limit=100');
      const json = await res.json();
      const allPosts: IPost[] = json.data || [];
      const userPosts = allPosts.filter((p) => p.author?.id === selectedUser.id);
      setPosts(userPosts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (!selectedUser && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">No users found</h2>
        <p className="text-slate-400 mb-6">Create a user to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* User Switcher */}
      {users.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">View profile for:</label>
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find((u) => String(u.id) === e.target.value);
              setSelectedUser(user || null);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
      )}

      {selectedUser && (
        <>
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-md p-8 mb-8 text-white">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {selectedUser.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{selectedUser.username}</h1>
                <p className="text-blue-200 mb-3">{selectedUser.email}</p>
                {selectedUser.bio && (
                  <p className="text-white/90 leading-relaxed">{selectedUser.bio}</p>
                )}
                <div className="mt-4 text-blue-200 text-sm">
                  Member since {formatDate(selectedUser.createdAt)}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-blue-200 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{posts.reduce((acc, p) => acc + (p.likes || 0), 0)}</div>
                <div className="text-blue-200 text-sm">Total Likes</div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Posts by {selectedUser.username}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 h-48 animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-4xl mb-3">✍️</div>
                <p className="text-slate-500">No posts yet. Start writing!</p>
                <Link
                  href="/posts/new"
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-48 bg-slate-200 rounded-2xl mb-6" />
          <div className="h-8 bg-slate-100 rounded mb-4 w-1/3" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-48 bg-slate-100 rounded-2xl" />
            <div className="h-48 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
