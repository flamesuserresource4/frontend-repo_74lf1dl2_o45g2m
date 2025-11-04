import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

const QUOTES = [
  {
    text: 'Focus is the art of knowing what to ignore.',
    author: 'James Clear',
  },
  {
    text: 'What gets measured gets managed.',
    author: 'Peter Drucker',
  },
  {
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    text: 'Discipline is choosing what you want most over what you want now.',
    author: 'Abraham Lincoln',
  },
  {
    text: 'Small progress is still progress.',
    author: 'Unknown',
  },
];

export default function QuoteWall() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [fade, setFade] = useState(false);

  const refresh = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
      setFade(false);
    }, 200);
  };

  useEffect(() => {
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, []);

  const q = QUOTES[index];

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent,#ef4444)]/10 via-transparent to-[var(--accent,#ef4444)]/10 pointer-events-none" />
      <div className="relative p-6 bg-white/80 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent,#ef4444)]/10">
              <Sparkles className="h-4 w-4 text-[var(--accent,#ef4444)]" />
            </span>
            <h2 className="font-medium text-gray-900 dark:text-white">Quote</h2>
          </div>
          <button onClick={refresh} className="inline-flex items-center gap-1 text-sm rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        <div className={`mt-4 transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-lg sm:text-xl leading-relaxed text-gray-900 dark:text-gray-50">
            “{q.text}”
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">— {q.author}</p>
        </div>
      </div>
    </div>
  );
}
