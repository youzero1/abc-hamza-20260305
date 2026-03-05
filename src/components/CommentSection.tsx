'use client';

import { useState, useEffect, useCallback } from 'react';
import CommentForm from './CommentForm';
import { IComment } from '@/types';

interface CommentSectionProps {
  postId: number;
}

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const json = await res.json();
      setComments(json.data || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleNewComment = (comment: IComment) => {
    setComments((prev) => [comment, ...prev]);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Comments{' '}
        <span className="text-slate-400 font-normal text-base">({comments.length})</span>
      </h2>

      <CommentForm postId={postId} onCommentAdded={handleNewComment} />

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-9 h-9 bg-slate-200 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded mb-2 w-1/4" />
                  <div className="h-4 bg-slate-100 rounded mb-1" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-slate-400">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                {comment.author?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-800 text-sm">
                      {comment.author?.username || 'Anonymous'}
                    </span>
                    <span className="text-slate-400 text-xs">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
