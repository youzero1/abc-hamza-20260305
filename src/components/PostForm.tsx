'use client';

import { useState } from 'react';
import { CreatePostDto, UpdatePostDto } from '@/types';

interface PostFormProps {
  onSubmit: (data: Omit<CreatePostDto, 'authorId'> | UpdatePostDto) => Promise<void>;
  loading?: boolean;
  initialData?: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
  };
  isEdit?: boolean;
}

export default function PostForm({ onSubmit, loading, initialData, isEdit }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      published,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-lg ${
            errors.title ? 'border-red-300' : 'border-slate-200'
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Excerpt */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Excerpt
          <span className="text-slate-400 font-normal ml-2">(short summary)</span>
        </label>
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description of your post..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
        {coverImage && (
          <div className="mt-3 h-32 rounded-xl overflow-hidden">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Content <span className="text-red-500">*</span>
          <span className="text-slate-400 font-normal ml-2">(supports basic markdown: # headings, **bold**, - lists)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          rows={16}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-mono text-sm resize-y ${
            errors.content ? 'border-red-300' : 'border-slate-200'
          }`}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        <p className="text-slate-400 text-xs mt-2">{content.length} characters</p>
      </div>

      {/* Publish Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-700">Publish Post</div>
            <div className="text-sm text-slate-400">
              {published ? 'This post will be visible to everyone' : 'Save as draft (not publicly visible)'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              published ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                published ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => history.back()}
          className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
