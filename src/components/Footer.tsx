import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                a
              </div>
              <span className="text-white text-xl font-bold">abc</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A modern social blogging platform for sharing your thoughts, ideas, and stories.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/posts', label: 'All Posts' },
                { href: '/posts/new', label: 'Create Post' },
                { href: '/profile', label: 'Profile' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-3">Community</h3>
            <p className="text-slate-400 text-sm mb-3">
              Join our blogging community and share your story.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors text-sm"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors text-sm"
                aria-label="GitHub"
              >
                ⌨
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors text-sm"
                aria-label="RSS"
              >
                ◉
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          © {currentYear} abc. All rights reserved. Built with Next.js & TypeScript.
        </div>
      </div>
    </footer>
  );
}
