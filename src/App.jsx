import React, { useEffect, useState } from 'react';
import HeroCover from './components/HeroCover.jsx';
import TodoWidget from './components/TodoWidget.jsx';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import RoutineTracker from './components/RoutineTracker.jsx';
import { Moon, Sun, Droplet } from 'lucide-react';

const THEME_KEY = 'plannerwall_theme_v1';
const ACCENT_KEY = 'plannerwall_accent_v1';

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [accent, setAccent] = useState(() => localStorage.getItem(ACCENT_KEY) || '#ef4444');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    localStorage.setItem(ACCENT_KEY, accent);
  }, [accent]);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top bar with theme + accent controls */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[var(--accent,#ef4444)]" aria-hidden />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Planner Wall</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Zen productivity dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-1.5 bg-white/70 dark:bg-zinc-900/60">
              <Droplet className="h-4 w-4" />
              <input
                aria-label="Pick accent color"
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-6 w-8 bg-transparent border-0 p-0 cursor-pointer"
              />
            </label>
            <button
              aria-label="Toggle theme"
              onClick={() => setDark((d) => !d)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-1.5 bg-white/70 dark:bg-zinc-900/60 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </header>

        <HeroCover />

        {/* Dashboard widgets */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TodoWidget />
            <RoutineTracker />
          </div>
          <div className="lg:col-span-1">
            <PomodoroTimer />
          </div>
        </main>

        <footer className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Built for flow • Theme and accent update in real time • Data stored locally
        </footer>
      </div>
    </div>
  );
}
