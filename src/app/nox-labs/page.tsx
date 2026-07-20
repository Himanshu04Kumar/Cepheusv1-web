// @ts-nocheck
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';

export default function NoxLabsPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <div className="fixed top-8 left-8 flex items-center gap-4">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6c76] dark:text-slate-500 hover:text-[#09090b] dark:hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Return
        </Link>
      </div>

      <div className="fixed top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter opacity-10 dark:opacity-20 select-none">NOX LABS</h1>

        <div className="space-y-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Advanced Hardware R&D</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] dark:text-slate-500">Protocol Layer · Phase 01</p>
        </div>

        <p className="text-xs text-[#4b5563] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Proprietary diagnostics and architectural assessment pipelines. Private build in progress.
        </p>
      </div>

      <div className="mt-24 w-12 h-px bg-black/5 dark:bg-white/5" />
    </div>
  );
}
