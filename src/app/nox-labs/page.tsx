// @ts-nocheck
'use client';

import Link from 'next/link';

export default function NoxLabsPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#09090b] font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col items-center justify-center p-6">
      <Link href="/" className="fixed top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6c76] hover:text-[#09090b] transition-colors">
        ← Return
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter opacity-10">NOX LABS</h1>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-indigo-600">Advanced Hardware R&D</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76]">In Built · Phase 01</p>
        </div>
      </div>

      <div className="mt-20 w-32 h-px bg-black/5" />
    </div>
  );
}
