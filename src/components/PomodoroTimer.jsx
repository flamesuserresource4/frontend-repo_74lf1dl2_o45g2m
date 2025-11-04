import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const STORAGE_KEY = 'plannerwall_pomodoro_v1';

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function PomodoroTimer() {
  const [workLen, setWorkLen] = useState(25);
  const [breakLen, setBreakLen] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(workLen * 60);
  const [sessions, setSessions] = useState(0);
  const tickRef = useRef(null);

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setWorkLen(s.workLen ?? 25);
        setBreakLen(s.breakLen ?? 5);
        setIsWork(s.isWork ?? true);
        setIsRunning(false);
        setSecondsLeft((s.isWork ? (s.workLen ?? 25) : (s.breakLen ?? 5)) * 60);
        setSessions(s.sessions ?? 0);
      }
    } catch {}
  }, []);

  // Persist minimal state on changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ workLen, breakLen, isWork, sessions })
    );
  }, [workLen, breakLen, isWork, sessions]);

  useEffect(() => {
    setSecondsLeft((isWork ? workLen : breakLen) * 60);
  }, [workLen, breakLen, isWork]);

  useEffect(() => {
    if (!isRunning) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // session complete
          if (isWork) setSessions((v) => v + 1);
          const nextIsWork = !isWork;
          setIsWork(nextIsWork);
          return (nextIsWork ? workLen : breakLen) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [isRunning, isWork, workLen, breakLen]);

  const reset = () => {
    setIsRunning(false);
    setIsWork(true);
    setSecondsLeft(workLen * 60);
  };

  const progress = 1 - secondsLeft / ((isWork ? workLen : breakLen) * 60);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent,#ef4444)]/10">
            <Timer className="h-4 w-4 text-[var(--accent,#ef4444)]" />
          </span>
          <h2 className="font-medium text-gray-900 dark:text-white">Focus Timer</h2>
        </div>
        <div className="text-xs text-gray-500">Sessions: {sessions}</div>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs uppercase tracking-wide text-gray-500">{isWork ? 'Focus' : 'Break'}</div>
            <div className="text-5xl font-semibold mt-1 text-gray-900 dark:text-white tabular-nums">{formatTime(secondsLeft)}</div>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-2 bg-[var(--accent,#ef4444)] transition-all"
                style={{ width: `${Math.min(Math.max(progress,0),1) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsRunning((r) => !r)}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent,#ef4444)] px-4 py-2 text-white shadow hover:opacity-90 transition"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Focus (min)</span>
            <input
              type="number"
              min="1"
              value={workLen}
              onChange={(e) => setWorkLen(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-md bg-transparent text-right outline-none"
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Break (min)</span>
            <input
              type="number"
              min="1"
              value={breakLen}
              onChange={(e) => setBreakLen(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-md bg-transparent text-right outline-none"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
