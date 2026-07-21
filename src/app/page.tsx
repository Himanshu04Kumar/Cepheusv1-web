// @ts-nocheck
'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Camera, ArrowRight, Globe, Menu, X, ChevronRight, Zap, Award, Users, MessageSquare, Clock, CheckCircle2, Instagram, Linkedin, Mail, Check, Layout, Database, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-slate-950 text-[#09090b] dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">

      {/* Drawer Menu */}
      <div className={`fixed inset-0 z-[100] bg-[#fbfbfa]/95 dark:bg-slate-950/95 backdrop-blur-xl transition-transform duration-700 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center">
            <Link href="/" className="logo text-lg font-black uppercase tracking-widest text-[#09090b] dark:text-white no-underline">CEPHEUS</Link>
            <button onClick={() => setMenuOpen(false)} className="p-3 bg-black/5 dark:bg-white/5 rounded-full hover:rotate-90 transition-all duration-300">
              <X size={24} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-12">
            <div className="space-y-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Navigation</p>
              <nav className="flex flex-col space-y-6">
                {['BOOK SERVICE', 'ACTIVE TRACKING', 'Institutional', 'NOX Labs', 'NOX Compute'].map((item) => (
                  <Link
                    key={item}
                    href={item.includes('BOOK') ? '/book' : item.includes('TRACK') ? '/track' : `/${item.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors text-[#09090b] dark:text-white"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="logo text-lg font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
            CEPHEUS
          </Link>
          <div className="flex items-center gap-3 md:gap-8">
            <ThemeToggle />
            <Link href="/book" className="flex bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 whitespace-nowrap">
              Book Now
            </Link>
            <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all">
              <Menu size={24} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - RESTORED from Screenshot */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[1] text-[#09090b] dark:text-white">
                Fix your device. <br />
                Without the anxiety.
              </h1>
              <p className="text-sm md:text-base text-slate-400 dark:text-slate-500 font-medium tracking-tight">
                Guaranteed 24-Hour Turnaround • Absolute Data Privacy • Fully Active Across Delhi
              </p>
            </div>

            {/* Checkmark Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
               <FeatureCheck label="Doorstep Inspection" />
               <FeatureCheck label="Verified Parts" />
               <FeatureCheck label="Live Tracking Log" />
               <FeatureCheck label="Your Data Stays Yours" />
               <FeatureCheck label="No Fix, No Fee" />
               <FeatureCheck label="1Y Warranty" />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/book" className="bg-indigo-600 text-white px-10 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20">
                Book a Repair
              </Link>
              <Link href="/track" className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-10 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#fbfbfa] dark:hover:bg-slate-800 transition-all text-[#09090b] dark:text-white shadow-sm">
                Track Your Repair
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Simulated Tracking Portal Graphic */}
          <div className="relative hidden lg:block">
            <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-1 px-1">
               <div className="bg-[#f8f8f7] dark:bg-slate-950 p-6 md:p-10 rounded-[2.2rem] space-y-10">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">CEPHEUS-TRACKING-PORTAL</p>
                  </div>

                  <div className="space-y-8">
                     <div className="flex justify-between items-center text-[#09090b] dark:text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">ACTIVE REPAIR:</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">DIAGNOSTIC VIEW ||</p>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />
                           <div>
                             <p className="text-sm font-black uppercase text-[#09090b] dark:text-white">01 / Secure Intake Logged</p>
                             <p className="text-[10px] text-slate-400 font-bold">Verified at door • Complete</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 animate-pulse">
                           <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />
                           <div>
                             <p className="text-sm font-black uppercase text-[#09090b] dark:text-white">02 / Live Component Diagnosis</p>
                             <p className="text-[10px] text-slate-400 font-bold">Teardown analysis in progress</p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-4">
                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Estimated Time:</p><p className="text-xs font-bold text-[#09090b] dark:text-white">24 Hours</p></div>
                        <div className="text-right"><p className="text-[9px] font-black text-slate-400 uppercase">Parts Status:</p><p className="text-[10px] font-black text-orange-500 uppercase">Pending Pre-Approval</p></div>
                     </div>
                  </div>
               </div>
            </div>
            {/* Status Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-5 py-3 rounded-full shadow-2xl flex items-center gap-3">
               <div className="bg-indigo-600/10 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black">NOW LIVE</div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#09090b] dark:text-white">Computers & Laptops • <span className="opacity-40">Expanding to new categories soon</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* How Do We Work Section */}
      <section className="px-6 md:px-12 py-32 bg-white dark:bg-slate-900 transition-colors border-y border-black/5 dark:border-white/5">
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
      </section>

      {/* Enterprise/Institutional Banner */}
      <section className="px-6 md:px-12 py-12 bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto bg-[#f8f8f7] dark:bg-slate-950 p-10 md:p-12 rounded-[3rem] border border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Managing devices for a school, college, or office?</h3>
            <p className="text-sm text-[#4b5563] dark:text-slate-400 leading-relaxed font-medium">We provide dedicated frameworks for institutional clients—featuring itemized audit trails, pre-approved pricing lists, and consolidated monthly invoicing without fixed commitments.</p>
          </div>
          <Link href="/institutional" className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#09090b] dark:text-white hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap">
            Explore Enterprise Solutions →
          </Link>
        </div>
      </section>

      {/* Footer - 5 Column RESTORED */}
      <footer className="px-6 md:px-12 py-32 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-20">
            <div className="col-span-2 md:col-span-1 space-y-8">
              <Link href="/" className="logo text-xl font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
                CEPHEUS
              </Link>
              <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight">
                Trust, at Infrastructure Scale.<br />
                Your device data is yours. We never sell or share it.
              </p>
            </div>

            <FooterCol title="Operations" links={['Book a Repair', 'Track Your Repair', 'Institutional Solutions']} />
            <FooterCol title="Ecosystem" links={['NOX Labs', 'NOX Compute']} />
            <FooterCol title="Framework" links={['Privacy Policy', 'Terms of Service', 'Audit Guidelines']} />
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Connect</p>
              <div className="flex gap-6 text-[#09090b] dark:text-white opacity-40 hover:opacity-100 transition-opacity">
                <Instagram size={18} /> <Linkedin size={18} /> <Mail size={18} />
              </div>
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-black/5 dark:border-white/5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              © 2026 CEPHEUS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCheck({ label }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 px-4 py-2 rounded-xl shadow-sm">
       <Check size={14} className="text-indigo-600" />
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    </div>
  );
}

function WorkStep({ number, title, desc, isLink }) {
  return (
    <div className="space-y-6">
      <p className="text-[10px] font-black text-slate-400 border-t border-black/5 dark:border-white/5 pt-4 uppercase">{number}</p>
      <div className="space-y-3">
        <h3 className="text-base font-black uppercase tracking-tighter text-[#09090b] dark:text-white">{title}</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{desc} {isLink && <span className="text-indigo-600 underline">Tracking Portal.</span>}</p>
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-8 text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{title}</p>
      <div className="flex flex-col space-y-3">
        {links.map((link) => (
          <Link key={link} href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">{link}</Link>
        ))}
      </div>
    </div>
  );
}
