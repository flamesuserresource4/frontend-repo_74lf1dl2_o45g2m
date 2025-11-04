import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ArrowUp, ArrowDown, CalendarDays } from 'lucide-react';

const STORAGE_KEY = 'plannerwall_todos_v1';

function parseSmart(text) {
  const t = text.trim();
  const now = new Date();
  let due = null;

  // very light smart parsing: today, tomorrow, in N days, yyyy-mm-dd
  if (/\btomorrow\b/i.test(t)) {
    const d = new Date(now);
    d.setDate(now.getDate() + 1);
    due = d.toISOString().slice(0, 10);
  } else if (/\btoday\b/i.test(t)) {
    due = now.toISOString().slice(0, 10);
  } else {
    const inDays = t.match(/in\s+(\d+)\s+days?/i);
    if (inDays) {
      const d = new Date(now);
      d.setDate(now.getDate() + parseInt(inDays[1], 10));
      due = d.toISOString().slice(0, 10);
    } else {
      const iso = t.match(/(\d{4}-\d{2}-\d{2})/);
      if (iso) due = iso[1];
    }
  }

  return { title: t.replace(/\b(tomorrow|today|in\s+\d+\s+days?)\b/gi, '').trim() || t, dueDate: due };
}

export default function TodoWidget() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [
        { id: 1, title: 'Plan the week', done: false, dueDate: new Date().toISOString().slice(0,10) },
        { id: 2, title: 'Buy milk', done: true, dueDate: null },
        { id: 3, title: '30m focus sprint', done: false, dueDate: null },
      ];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const parsed = parseSmart(input);
    setTodos((prev) => [
      { id: Date.now(), title: parsed.title, done: false, dueDate: parsed.dueDate },
      ...prev,
    ]);
    setInput('');
  };

  const toggle = (id) => setTodos((prev) => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => setTodos((prev) => prev.filter(t => t.id !== id));
  const move = (index, dir) => {
    setTodos((prev) => {
      const arr = [...prev];
      const newIndex = index + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      const [item] = arr.splice(index, 1);
      arr.splice(newIndex, 0, item);
      return arr;
    });
  };

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.done);
    if (filter === 'done') return todos.filter(t => t.done);
    return todos;
  }, [todos, filter]);

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent,#ef4444)]/10">
            <CalendarDays className="h-4 w-4 text-[var(--accent,#ef4444)]" />
          </span>
          <h2 className="font-medium text-gray-900 dark:text-white">Todos</h2>
        </div>
        <div className="flex gap-1 text-sm">
          <button onClick={() => setFilter('all')} className={`px-2 py-1 rounded-md transition ${filter==='all'?'bg-gray-900 text-white dark:bg-white dark:text-black':'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300'}`}>All</button>
          <button onClick={() => setFilter('active')} className={`px-2 py-1 rounded-md transition ${filter==='active'?'bg-gray-900 text-white dark:bg-white dark:text-black':'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300'}`}>Active</button>
          <button onClick={() => setFilter('done')} className={`px-2 py-1 rounded-md transition ${filter==='done'?'bg-gray-900 text-white dark:bg-white dark:text-black':'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300'}`}>Done</button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <input
            aria-label="Add todo"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent,#ef4444)]/40"
            placeholder="e.g. buy milk tomorrow"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent,#ef4444)] px-3 py-2 text-white shadow hover:opacity-90 active:opacity-100 transition"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {filtered.map((t, idx) => (
            <li key={t.id} className="group flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-zinc-950 px-3 py-2">
              <button aria-label={t.done? 'Mark as not done':'Mark as done'} onClick={() => toggle(t.id)} className="shrink-0 text-[var(--accent,#ef4444)]">
                {t.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${t.done? 'line-through text-gray-400':'text-gray-900 dark:text-gray-100'}`}>{t.title}</p>
                {t.dueDate && (
                  <p className="text-xs text-gray-500">Due {t.dueDate}</p>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button aria-label="Move up" onClick={() => move(idx, -1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"><ArrowUp className="h-4 w-4" /></button>
                <button aria-label="Move down" onClick={() => move(idx, 1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"><ArrowDown className="h-4 w-4" /></button>
                <button aria-label="Delete" onClick={() => remove(t.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-sm text-gray-500 py-6 text-center">Nothing here — add your first task above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
