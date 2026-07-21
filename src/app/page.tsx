// @ts-nocheck
'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Camera, ArrowRight, Globe, Menu, X, ChevronRight, Zap, Award, Users, MessageSquare, Clock, CheckCircle2, Instagram, Linkedin, Mail } from 'lucide-react';
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

      {/* Drawer Menu - RESTORED & FIXED */}
      <div className={`fixed inset-0 z-[100] bg-[#fbfbfa]/95 dark:bg-slate-950/95 backdrop-blur-xl transition-transform duration-700 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-end">
            <button onClick={() => setMenuOpen(false)} className="p-3 bg-black/5 dark:bg-white/5 rounded-full hover:rotate-90 transition-all duration-300">
              <X size={24} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-12">
            <div className="space-y-4">
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

      {/* Sticky Header - BOOK SERVICE NOW VISIBLE ON MOBILE */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between">
          <Link href="/" className="logo text-lg font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
            CEPHEUS
          </Link>
          <div className="flex items-center gap-2 md:gap-8">
            <ThemeToggle />
            {/* REMOVED hidden md:flex -> Now visible on all devices */}
            <Link href="/book" className="flex bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] px-4 md:px-8 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-indigo-600/10 whitespace-nowrap">
              BOOK SERVICE
            </Link>
            <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all">
              <Menu size={24} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600/10 rounded-full border border-indigo-600/20">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Premium Infrastructure</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-[#09090b] dark:text-white">
                Next-Gen <br />
                <span className="text-indigo-600 italic">Repair</span> System
              </h1>
            </div>
            <p className="text-lg md:text-xl text-[#4b5563] dark:text-slate-400 max-w-lg leading-relaxed font-medium uppercase tracking-tight">
              A premium, full-stack laptop repair platform with radical transparency, real-time tracking, and multi-tier security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book" className="h-16 flex items-center justify-center bg-indigo-600 text-white px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 group">
                BOOK SERVICE <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/track" className="h-16 flex items-center justify-center bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#fbfbfa] dark:hover:bg-slate-800 transition-all text-[#09090b] dark:text-white shadow-sm">
                ACTIVE TRACKING
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-indigo-600/5 dark:bg-indigo-500/5 rounded-full blur-[100px]" />
            <div className="relative border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200" alt="Tech" className="rounded-[2.2rem] grayscale group-hover:grayscale-0 transition-all duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 md:px-12 py-32 bg-white dark:bg-slate-900 transition-colors duration-500 border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Features</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Precision Redefined.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<Truck />} title="Doorstep Pick-Up" desc="Professional logistics agents collect your machine from your verified coordinates." />
            <FeatureCard icon={<ShieldCheck />} title="Verified Security" desc="All technicians are background-checked and data-integrity certified." />
            <FeatureCard icon={<Camera />} title="Evidence Log" desc="Real-time photographic proof of all component removals and installations." />
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="px-6 md:px-12 py-32 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 text-[#09090b] dark:text-white">
            <div className="col-span-1 md:col-span-1 space-y-8 text-[#09090b] dark:text-white">
              <Link href="/" className="logo text-2xl font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
                CEPHEUS
              </Link>
              <p className="text-sm font-medium text-[#4b5563] dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                Trust, at Infrastructure Scale.<br />
                Your device data is yours. We never sell or share it.
              </p>
            </div>

            <FooterColumn title="Operations" links={['BOOK SERVICE', 'ACTIVE TRACKING', 'Institutional Solutions']} />
            <FooterColumn title="Ecosystem" links={['NOX Labs', 'NOX Compute']} />
            <FooterColumn title="Framework" links={['Privacy Policy', 'Terms of Service']} />
          </div>

          <div className="mt-32 pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              © 2026 Cepheus Technology Protocol.
            </p>
            <div className="flex gap-8 text-[#09090b] dark:text-white">
              <Instagram size={18} />
              <Linkedin size={18} />
              <Mail size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group p-10 rounded-[3rem] bg-[#fbfbfa] dark:bg-slate-950 border border-black/5 dark:border-white/5 hover:border-indigo-600/30 hover:shadow-2xl transition-all duration-700">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8">
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[#09090b] dark:text-white">{title}</h3>
      <p className="text-sm font-medium text-[#4b5563] dark:text-slate-400 leading-relaxed uppercase tracking-tight">{desc}</p>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="space-y-8">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">{title}</p>
      <div className="flex flex-col space-y-4">
        {links.map((link) => (
          <Link
            key={link}
            href={link.includes('BOOK') ? '/book' : link.includes('TRACK') ? '/track' : `/${link.toLowerCase().replace(' ', '-')}`}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#4b5563] dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
          >
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}
