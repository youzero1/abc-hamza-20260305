import Link from 'next/link';
import { IPost } from '@/types';

interface PostCardProps {
  post: IPost;
}

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Cover Image */}
      {post.coverImage ? (
        <div className="h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {post.author?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="text-sm">
            <span className="font-medium text-slate-700">
              {post.author?.username || 'Anonymous'}
            </span>
            <span className="text-slate-400 ml-2">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h2 className="text-lg font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <span>❤️</span>
              <span>{post.likes || 0}</span>
            </span>
            {post.comments && (
              <span className="flex items-center gap-1">
                <span>💬</span>
                <span>{post.comments.length}</span>
              </span>
            )}
          </div>
          <Link
            href={`/posts/${post.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
