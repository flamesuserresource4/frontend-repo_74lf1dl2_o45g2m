import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative w-full h-[28rem] sm:h-[34rem] rounded-2xl overflow-hidden shadow-xl">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/cEecEwR6Ehj4iT8T/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlays for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent dark:from-black/50 dark:via-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent dark:from-white/0" />

      <div className="relative z-10 h-full flex items-end p-6 sm:p-10">
        <div className="backdrop-blur-sm bg-white/40 dark:bg-white/10 rounded-xl p-4 sm:p-6 shadow-lg max-w-xl">
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Planner Wall
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-200">
            Your calm, all‑in‑one productivity space — todos, routines, planner, focus and inspiration.
          </p>
        </div>
      </div>
    </section>
  );
}
