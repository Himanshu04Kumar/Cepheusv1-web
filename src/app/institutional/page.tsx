// @ts-nocheck
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Instagram, Linkedin, Mail } from 'lucide-react';

export default function InstitutionalPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="logo text-sm font-extrabold uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
            CEPHEUS
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/" className="text-[11px] font-bold uppercase tracking-wider text-[#4b5563] dark:text-slate-400 hover:text-[#09090b] dark:hover:text-white transition-colors no-underline">
              Consumer Portal
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-40 pb-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Column: Value Props */}
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-black tracking-widest text-[#6b6c76] dark:text-slate-500 uppercase">MANIFEST 05 · CORPORATE & INSTITUTIONAL</span>
            </div>
            <h1 className="text-[2.75rem] md:text-[4rem] font-extrabold leading-[1.1] tracking-tight text-[#09090b] dark:text-white">
              Corporate Fleet<br/>
              <span className="bg-gradient-to-b from-[#09090b] dark:from-white to-[#4b5563] dark:to-slate-400 bg-clip-text text-transparent italic text-white">Maintenance.</span>
            </h1>
          </div>

          <p className="text-sm md:text-base text-[#4b5563] dark:text-slate-400 leading-relaxed max-w-md font-medium">
            Consolidated device repair management for teams, corporate offices, and educational institutes operating in Delhi NCR. Keep your hardware assets optimized under guaranteed SLAs.
          </p>

          <div className="space-y-6 pt-4 text-white">
            <ValuePillar index="01" title="Enterprise SLAs & Priority Support" text="Guaranteed 24-hour turnaround on critical diagnostic pipelines, minimizing hardware downtime for your workforce." />
            <ValuePillar index="02" title="Consolidated Monthly Ledger Invoicing" text="Eliminate out-of-pocket employee expenses. Access a unified dashboard with transparent billing line-items." />
            <ValuePillar index="03" title="Audit-Ready Documented Timelines" text="Every single repair teardown is documented with high-fidelity photo proof and logged permanently for IT audit compliance." />
          </div>
        </div>

        {/* Right Column: Onboarding Form */}
        <div className="animate-in fade-in zoom-in duration-1000 delay-300 text-white">
          <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-[2rem] p-10 shadow-2xl shadow-black/[0.02] space-y-8 text-white">
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-[#09090b] dark:text-white text-white">Onboarding Application</h2>
              <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mt-1">FLEET REQUISITION · SUBMIT FOR BULK RATES</p>
            </div>

            <form className="space-y-5 text-white" onSubmit={(e) => e.preventDefault()}>
              <FormGroup label="Company / Institution Name" placeholder="e.g. Acme Corporation Pvt. Ltd." />

              <div className="grid grid-cols-2 gap-4 text-white">
                <FormGroup label="Contact Person" placeholder="e.g. Jane Doe" />
                <FormGroup label="Job Designation" placeholder="e.g. IT Manager" />
              </div>

              <FormGroup label="Corporate Email Address" placeholder="e.g. procurement@acme.com" type="email" />

              <div className="grid grid-cols-2 gap-4 text-white">
                <FormGroup label="Phone Number" placeholder="+91..." type="tel" />
                <FormGroup label="Estimated Fleet Size" placeholder="e.g. 150" type="number" />
              </div>

              <div className="space-y-2 text-white">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] dark:text-slate-500 ml-1">Headquarters Address</label>
                <textarea className="w-full bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-indigo-500 transition-colors min-h-[100px] text-[#09090b] dark:text-white text-white" placeholder="Specify primary office street location..." />
              </div>

              <button className="w-full bg-[#09090b] dark:bg-indigo-600 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-xl shadow-black/10">
                Submit Fleet Application
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">Our team typically responds within one business day.</p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f4] dark:bg-slate-900/50 border-t border-black/5 dark:border-white/5 pt-20 pb-10 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-white text-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-20 text-white text-white">
            <div className="space-y-4 text-white text-white">
              <span className="text-lg font-black tracking-widest text-[#09090b] dark:text-white text-white text-white">CEPHEUS</span>
              <p className="text-xs text-[#4b5563] dark:text-slate-400 leading-relaxed max-w-xs text-white">Trust, at Infrastructure Scale.<br/>Your device data is yours. We never sell or share it.</p>
            </div>
            <div className="flex gap-12 text-white text-white text-white">
               <FooterCol title="Operations" links={[{label: 'Consumer Portal', href: '/'}, {label: 'Track Registry', href: '/track'}]} />
               <FooterCol title="Connect" links={[{label: 'LinkedIn', href: '/coming-soon'}, {label: 'Corporate Email', href: 'mailto:info@cepheus.co.in'}]} />
            </div>
          </div>
          <div className="border-t border-black/5 dark:border-white/5 pt-8 text-[10px] font-mono text-[#6b6c76] dark:text-slate-500">
            &copy; 2026 Cepheus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ValuePillar({ index, title, text }) {
  return (
    <div className="flex gap-6 py-6 border-b border-black/5 dark:border-white/5 last:border-0 text-white text-white">
      <span className="text-xs font-mono font-black text-slate-300 dark:text-slate-700 mt-1">{index}</span>
      <div>
        <h4 className="text-sm font-bold text-[#09090b] dark:text-white mb-1">{title}</h4>
        <p className="text-xs text-[#6b7280] dark:text-slate-400 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function FormGroup({ label, placeholder, type = "text" }) {
  return (
    <div className="space-y-2 text-white text-white">
      <label className="text-[10px] font-black uppercase tracking-widest text-[#6b6c76] dark:text-slate-500 ml-1">{label}</label>
      <input type={type} className="w-full bg-[#f8f8f7] dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-indigo-500 transition-colors text-[#09090b] dark:text-white text-white" placeholder={placeholder} required />
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-4 text-white text-white text-white">
      <h5 className="text-[11px] font-black text-[#09090b] dark:text-white uppercase tracking-wider text-white">{title}</h5>
      <div className="flex flex-col gap-2.5 text-white">
        {links.map((l, i) => (
          <Link key={i} href={l.href} className="text-[11px] text-[#4b5563] dark:text-slate-400 hover:text-[#09090b] dark:hover:text-white transition-colors no-underline font-bold uppercase tracking-tighter text-white">{l.label}</Link>
        ))}
      </div>
    </div>
  );
}
