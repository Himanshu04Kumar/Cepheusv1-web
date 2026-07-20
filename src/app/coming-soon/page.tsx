// @ts-nocheck
'use client';

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col items-center justify-center p-6 text-center">
      <Link href="/" className="fixed top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#6b6c76] hover:text-[#09090b] dark:hover:text-white transition-colors">
        ← Return
      </Link>

      <div className="space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto">
          <Clock className="text-indigo-600" size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Protocol Pending</h1>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-indigo-600">Coming Soon</p>
        </div>

        <p className="text-sm text-[#4b5563] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          We are currently engineering this section of the Cepheus registry. Check back shortly for full deployment.
        </p>

        <div className="pt-8">
          <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Back to Hub
          </Link>
        </div>
      </div>

      <div className="mt-20 w-32 h-px bg-black/5 dark:bg-white/5" />
    </div>
  );
}
