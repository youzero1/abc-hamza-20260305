import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { IPost } from '@/types';

async function getRecentPosts(): Promise<IPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts?page=1&limit=6`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getRecentPosts();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Welcome to{' '}
            <span className="text-blue-200">abc</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            A modern social blogging platform where you can share your thoughts,
            ideas, and stories with the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/posts"
              className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Explore Posts
            </Link>
            <Link
              href="/posts/new"
              className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-400 transition-colors border-2 border-blue-400 shadow-lg"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{posts.length}+</div>
              <div className="text-slate-500 text-sm">Recent Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">∞</div>
              <div className="text-slate-500 text-sm">Ideas to Share</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-slate-500 text-sm">Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Recent Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts yet</h3>
            <p className="text-slate-400 mb-6">Be the first to share something!</p>
            <Link
              href="/posts/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to share your story?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join the abc community and start writing today.
          </p>
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-blue-500 transition-colors text-lg"
          >
            Create Your First Post
          </Link>
        </div>
      </section>
    </div>
  );
}
