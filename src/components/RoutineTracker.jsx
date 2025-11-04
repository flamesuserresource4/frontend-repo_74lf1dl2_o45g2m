import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, Plus, Trash2, Flame, CalendarDays } from 'lucide-react';

const STORAGE_KEY = 'plannerwall_routines_v1';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function RoutineTracker() {
  const [routines, setRoutines] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 1, title: 'Morning stretch', history: [], streak: 0, lastDone: null },
      { id: 2, title: 'Read 10 pages', history: [], streak: 0, lastDone: null },
      { id: 3, title: 'Evening walk', history: [], streak: 0, lastDone: null },
    ];
  });
  const [input, setInput] = useState('');
  const key = todayKey();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  // Mark done/undone for today and maintain streaks
  const toggleToday = (id) => {
    setRoutines((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const wasDoneToday = r.history.includes(key);
      let next = { ...r };
      if (wasDoneToday) {
        next.history = r.history.filter((d) => d !== key);
        // undoing today does not modify historical streak, but streak should reflect consecutive days up to yesterday
        // Recompute streak from history quickly
        next.streak = computeStreak(next.history);
        next.lastDone = next.history[next.history.length - 1] || null;
      } else {
        next.history = [...r.history, key].sort();
        // Update streak: if last done was yesterday, +1, otherwise 1
        const y = new Date(key);
        y.setDate(y.getDate() - 1);
        const yKey = y.toISOString().slice(0,10);
        if (r.lastDone === yKey) next.streak = (r.streak || 0) + 1; else next.streak = 1;
        next.lastDone = key;
      }
      return next;
    }));
  };

  function computeStreak(history) {
    if (!history || history.length === 0) return 0;
    const set = new Set(history);
    let count = 0;
    let d = new Date(todayKey());
    while (true) {
      const k = d.toISOString().slice(0,10);
      if (set.has(k)) {
        count += 1;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  }

  const addRoutine = () => {
    if (!input.trim()) return;
    setRoutines((prev) => [
      { id: Date.now(), title: input.trim(), history: [], streak: 0, lastDone: null },
      ...prev,
    ]);
    setInput('');
  };

  const removeRoutine = (id) => setRoutines((prev) => prev.filter((r) => r.id !== id));

  const stats = useMemo(() => {
    const completed = routines.filter((r) => r.history.includes(key)).length;
    return { total: routines.length, completed };
  }, [routines, key]);

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent,#ef4444)]/10">
            <CalendarCheck2 className="h-4 w-4 text-[var(--accent,#ef4444)]" />
          </span>
          <h2 className="font-medium text-gray-900 dark:text-white">Routines</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {key}</div>
          <div className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" /> {stats.completed}/{stats.total} today</div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <input
            aria-label="Add routine"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent,#ef4444)]/40"
            placeholder="e.g. Journal for 5 minutes"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRoutine()}
          />
          <button
            onClick={addRoutine}
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent,#ef4444)] px-3 py-2 text-white shadow hover:opacity-90 active:opacity-100 transition"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {routines.map((r) => {
            const doneToday = r.history.includes(key);
            return (
              <li key={r.id} className="group flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-zinc-950 px-3 py-2">
                <button
                  aria-label={doneToday ? 'Unmark for today' : 'Mark done for today'}
                  onClick={() => toggleToday(r.id)}
                  className={`shrink-0 size-6 rounded-md border ${doneToday ? 'bg-[var(--accent,#ef4444)] border-[var(--accent,#ef4444)]' : 'border-gray-300 dark:border-gray-700'} transition`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{r.title}</p>
                  <p className="text-xs text-gray-500">Streak: {r.streak} {r.streak === 1 ? 'day' : 'days'}</p>
                </div>
                <button
                  aria-label="Remove routine"
                  onClick={() => removeRoutine(r.id)}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
          {routines.length === 0 && (
            <li className="text-sm text-gray-500 py-6 text-center">No routines yet — add your first above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
