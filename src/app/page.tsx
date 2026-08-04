// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Menu,
  X,
  Shield,
  Zap,
  Clock,
  ChevronRight,
  Instagram,
  Linkedin,
  Mail,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">

      {/* MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 bg-white dark:bg-slate-950 z-[100] transition-all duration-700 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} p-8 flex flex-col justify-between`}>
        <div className="flex justify-between items-center">
          <Link href="/" onClick={() => setMenuOpen(false)} className="logo text-2xl font-black uppercase tracking-[0.2em]">CEPHEUS</Link>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">MENU</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 bg-black/5 dark:bg-white/5 rounded-full">
              <X size={24} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
        </div>
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Services</p>
            <div className="flex flex-col gap-4">
              <Link href="/book" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">Book a Repair</Link>
              <Link href="/track" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">Track Your Repair</Link>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Partnerships</p>
            <div className="flex flex-col gap-4">
              <Link href="/institutional" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">Institutional Solutions</Link>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Resources</p>
            <div className="flex flex-col gap-4 text-slate-400">
              <Link href="/coming-soon" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">FAQs</Link>
              <Link href="/coming-soon" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">Warranty Policy</Link>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Coming Soon</p>
            <div className="flex flex-col gap-4 text-slate-400">
              <Link href="/nox-labs" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">NOX Labs</Link>
              <Link href="/nox-compute" onClick={() => setMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors">NOX Compute</Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><Instagram size={16} /></div>
            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><Linkedin size={16} /></div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Fully Live Across Delhi</span>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="px-6 md:px-12 py-8 flex items-center justify-between sticky top-0 bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl z-50 transition-colors border-b border-black/[0.03] dark:border-white/[0.03]">
        <div className="flex items-center gap-12">
          <Link href="/" className="logo text-lg font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
            CEPHEUS
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <ThemeToggle />
          <Link href="/book" className="flex bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 whitespace-nowrap">
            Initialize Repair
          </Link>
          <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <Menu size={24} className="text-[#09090b] dark:text-white" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-6 md:px-12 pt-24 pb-32 text-center md:text-left relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-[#09090b] dark:text-white">
                Electronics <br />
                <span className="text-indigo-600">Without the <br /> anxiety.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium uppercase tracking-tight max-w-lg leading-tight">
                Doorstep pickup, photographic documentation, and verifiable warranty. Experience repair at infrastructure scale.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/book" className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 min-w-[200px] text-center">
                Book a Repair
              </Link>
              <Link href="/track" className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-10 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#fbfbfa] dark:hover:bg-slate-800 transition-all text-[#09090b] dark:text-white shadow-sm min-w-[200px] text-center">
                Track Unit
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
               <PillarTag label="Delhi/NCR Live" />
               <PillarTag label="1-Year Warranty" />
               <PillarTag label="Secure Logistics" />
               <PillarTag label="Photo Evidence" />
            </div>
          </div>

          {/* Abstract Console/UI Visual */}
          <div className="flex-1 hidden lg:block w-full">
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-[3rem] p-12 shadow-2xl relative group overflow-hidden transition-all duration-700 hover:shadow-indigo-500/10">
                 <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-6">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">cepheus-tracking-portal</p>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Unit: #8821-X</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center"><Shield size={20} className="text-indigo-600" /></div>
                    </div>
                     <div className="flex justify-between items-center text-[#09090b] dark:text-white text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">ACTIVE REPAIR:</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">DIAGNOSTIC VIEW ||</p>
                     </div>
                     <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                           <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                           <div className="text-left">
                             <p className="text-sm font-black uppercase text-[#09090b] dark:text-white">01 / Secure Intake Logged</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Verified at door • Complete</p>
                           </div>
                        </div>
                        <div className="flex gap-4 items-start">
                           <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                           <div className="text-left">
                             <p className="text-sm font-black uppercase text-[#09090b] dark:text-white">02 / Live Component Diagnosis</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Teardown analysis in progress</p>
                           </div>
                        </div>
                     </div>
                     <div className="pt-8 border-t border-black/5 dark:border-white/5 flex justify-between">
                        <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">ESTIMATED TIME:</p><p className="text-xs font-bold text-[#09090b] dark:text-white">24 Hours</p></div>
                        <div className="text-right"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">PARTS STATUS:</p><p className="text-[10px] font-black text-orange-500 uppercase">PENDING PRE-APPROVAL</p></div>
                     </div>
                 </div>
            </div>
            <div className="mt-8 flex justify-between items-center px-10">
               <div className="bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest">Now Live</div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#09090b] dark:text-white">Computers & Laptops • <span className="opacity-40">Expanding soon</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW STREAM */}
      <main className="px-6 md:px-12 py-32 bg-white dark:bg-slate-900 transition-colors border-y border-black/5 dark:border-white/5 text-left">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">How Do We Work?</h2>
            <p className="text-base text-slate-400 font-medium uppercase tracking-tight">Simple. Fast. Reliable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <WorkStep number="01" title="Book a Repair" desc="Choose a convenient pickup slot from your home or campus." />
            <WorkStep number="02" title="Doorstep Inspection" desc="We verify basic device conditions at your door and log it live into our tracker." />
            <WorkStep number="03" title="Live Diagnosis" desc="Review itemized costs and approve the fix at your Tracking Portal." isLink />
            <WorkStep number="04" title="Documented Fix" desc="Watch your repair unfold with live photos and certified parts verification." />
            <WorkStep number="05" title="Secure Return" desc="Safe delivery with up to 1-year warranty and total data privacy." />
          </div>
        </div>

        {/* Institutional Inline Banner */}
        <div className="max-w-7xl mx-auto bg-[#f8f8f7] dark:bg-slate-950 p-10 md:p-12 rounded-[3rem] border border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 mt-20">
          <div className="space-y-4 max-w-2xl text-left">
            <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Managing devices for a school, college, or office?</h4>
            <p className="text-sm text-[#4b5563] dark:text-slate-400 leading-relaxed font-medium uppercase tracking-tight">We provide dedicated frameworks for institutional clients—featuring itemized audit trails and pre-approved pricing lists.</p>
          </div>
          <Link href="/institutional" className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#09090b] dark:text-white hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap">
            Explore Enterprise Solutions →
          </Link>
        </div>
      </main>

      {/* FOOTER ARCHITECTURE */}
      <footer className="px-6 md:px-12 py-32 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-20">
            <div className="col-span-2 md:col-span-1 space-y-8 text-left">
              <Link href="/" className="logo text-xl font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline text-left">
                CEPHEUS
              </Link>
              <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight">
                Trust, at Infrastructure Scale.<br />
                Your device data is yours.
              </p>
            </div>

            <FooterCol title="Operations" links={['Book a Repair', 'Track Your Repair', 'Institutional Solutions']} />
            <FooterCol title="Ecosystem" links={['NOX Labs', 'NOX Compute']} />
            <FooterCol title="Framework" links={['Privacy Policy', 'Terms of Service', 'Audit Guidelines']} />
            <div className="space-y-8 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Connect</p>
              <div className="flex gap-6 text-[#09090b] dark:text-white opacity-40 hover:opacity-100 transition-opacity">
                <Instagram size={18} /> <Linkedin size={18} /> <Mail size={18} />
              </div>
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-black/5 dark:border-white/5 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              © 2026 CEPHEUS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PillarTag({ label }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 px-4 py-2 rounded-xl shadow-sm text-left">
       <span className="text-indigo-600 font-bold">✓</span>
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    </div>
  );
}

function WorkStep({ number, title, desc, isLink }) {
  return (
    <div className="space-y-6 text-left">
      <p className="text-[10px] font-black text-slate-400 border-t border-black/5 dark:border-white/5 pt-4 uppercase">{number}</p>
      <div className="space-y-3">
        <h3 className="text-base font-black uppercase tracking-tighter text-[#09090b] dark:text-white">{title}</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          {desc} {isLink && <Link href="/track" className="text-indigo-600 underline">Tracking Portal.</Link>}
        </p>
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  const linkMap = {
    'Book a Repair': '/book',
    'Track Your Repair': '/track',
    'Institutional Solutions': '/institutional',
    'NOX Labs': '/nox-labs',
    'NOX Compute': '/nox-compute',
    'Privacy Policy': '/coming-soon',
    'Terms of Service': '/coming-soon',
    'Audit Guidelines': '/coming-soon'
  };

  return (
    <div className="space-y-8 text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{title}</p>
      <div className="flex flex-col space-y-3 text-left">
        {links.map((link) => (
          <Link key={link} href={linkMap[link] || '/'} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors text-left">{link}</Link>
        ))}
      </div>
    </div>
  );
}
