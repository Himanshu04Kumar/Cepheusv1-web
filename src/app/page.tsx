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

      {/* Drawer Menu - Mobile Optimized */}
      <div className={`fixed inset-0 z-[100] bg-[#fbfbfa]/98 dark:bg-slate-950/98 backdrop-blur-xl transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 md:p-8 h-full flex flex-col">
          <div className="flex justify-between items-center">
            <Link href="/" className="logo text-sm font-black uppercase tracking-widest text-[#09090b] dark:text-white no-underline">Cepheus<span className="text-indigo-600">.</span></Link>
            <button onClick={() => setMenuOpen(false)} className="p-3 bg-black/5 dark:bg-white/5 rounded-full">
              <X size={20} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8 md:space-y-12">
            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Navigation</p>
              <nav className="flex flex-col space-y-4 md:space-y-6">
                {['Book a Repair', 'Track Your Repair', 'Institutional', 'NOX Labs', 'NOX Compute'].map((item) => (
                  <Link
                    key={item}
                    href={item.toLowerCase().includes('book') ? '/book' : item.toLowerCase().includes('track') ? '/track' : `/${item.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl md:text-6xl font-black uppercase tracking-tighter hover:text-indigo-600 transition-colors text-[#09090b] dark:text-white"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
              <div className="flex gap-6">
                <Instagram className="cursor-pointer hover:text-indigo-600 transition-colors" size={20} />
                <Linkedin className="cursor-pointer hover:text-indigo-600 transition-colors" size={20} />
                <Mail className="cursor-pointer hover:text-indigo-600 transition-colors" size={20} />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Trust, at Infrastructure Scale.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header - Improved Mobile Visibility */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#fbfbfa]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between">
          <Link href="/" className="logo text-base font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">
            Cepheus<span className="text-indigo-600">.</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-8">
            <ThemeToggle />
            <Link href="/book" className="flex bg-indigo-600 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              Book Now
            </Link>
            <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all">
              <Menu size={20} className="text-[#09090b] dark:text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Balanced Spacing */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-40 px-5 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative z-10 space-y-8 md:space-y-10 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600/10 rounded-full border border-indigo-600/20 mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Premium Infrastructure</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-[#09090b] dark:text-white">
                Next-Gen <br className="hidden md:block" />
                <span className="text-indigo-600 italic">Repair</span> System
              </h1>
            </div>
            <p className="text-base md:text-xl text-[#4b5563] dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium uppercase tracking-tight">
              A premium, full-stack laptop repair platform with radical transparency, real-time tracking, and multi-tier security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/book" className="group bg-indigo-600 text-white px-8 py-4.5 md:py-5 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20">
                Initiate Service <ArrowRight size={16} />
              </Link>
              <Link href="/track" className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 px-8 py-4.5 md:py-5 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center text-[#09090b] dark:text-white shadow-sm">
                Active Tracking
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-indigo-600/5 rounded-full blur-[100px]" />
            <div className="relative border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl">
               <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200" alt="Tech" className="rounded-[2.2rem] grayscale opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Responsive Cards */}
      <section className="px-5 md:px-12 py-20 md:py-32 bg-white dark:bg-slate-900 transition-colors border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
          <div className="text-center space-y-4">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Features</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#09090b] dark:text-white">Precision Redefined.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard icon={<Truck size={20}/>} title="Doorstep Pick-Up" desc="Professional logistics agents collect your machine from your verified coordinates." />
            <FeatureCard icon={<ShieldCheck size={20}/>} title="Verified Security" desc="All technicians are background-checked and data-integrity certified." />
            <FeatureCard icon={<Camera size={20}/>} title="Evidence Log" desc="Real-time photographic proof of all component removals and installations." />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="px-5 md:px-12 py-24 md:py-40 text-center bg-[#fbfbfa] dark:bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-8">
          <Globe className="mx-auto text-indigo-600 dark:text-indigo-400" size={32} />
          <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-[#09090b] dark:text-white">
            Your device data is <span className="text-indigo-600 italic">yours.</span> We never sell or share it.
          </h2>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 italic">Cepheus Technology Protocol</p>
        </div>
      </section>

      {/* Footer - Optimized Grid */}
      <footer className="px-5 md:px-12 py-20 md:py-32 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
            <div className="col-span-2 md:col-span-1 space-y-6 md:space-y-8">
              <Link href="/" className="logo text-xl font-black uppercase tracking-[0.15em] text-[#09090b] dark:text-white no-underline">Cepheus<span className="text-indigo-600">.</span></Link>
              <p className="text-[11px] font-medium text-[#4b5563] dark:text-slate-400 leading-relaxed uppercase tracking-tight">Trust, at Infrastructure Scale.<br />Your device data is yours.</p>
            </div>
            <FooterColumn title="Operations" links={['Book a Repair', 'Track Your Repair', 'Institutional Solutions']} />
            <FooterColumn title="Ecosystem" links={['NOX Labs', 'NOX Compute']} />
            <FooterColumn title="Framework" links={['Privacy Policy', 'Terms of Service']} />
          </div>
          <div className="mt-20 pt-10 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">© 2026 Cepheus Technology Protocol. All rights reserved.</p>
            <div className="flex gap-6 text-[#09090b] dark:text-white opacity-40 hover:opacity-100 transition-opacity">
              <Instagram size={16} /> <Linkedin size={16} /> <Mail size={16} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#fbfbfa] dark:bg-slate-950 border border-black/5 dark:border-white/5 shadow-sm hover:border-indigo-600/20 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">{icon}</div>
      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 text-[#09090b] dark:text-white">{title}</h3>
      <p className="text-[12px] md:text-sm font-medium text-[#4b5563] dark:text-slate-400 leading-relaxed uppercase tracking-tight">{desc}</p>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="space-y-6 md:space-y-8">
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">{title}</p>
      <div className="flex flex-col space-y-3">
        {links.map((link) => (
          <Link key={link} href={link.toLowerCase().includes('book') ? '/book' : link.toLowerCase().includes('track') ? '/track' : `/${link.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-black uppercase tracking-widest text-[#4b5563] dark:text-slate-400 hover:text-indigo-600 transition-colors">{link}</Link>
        ))}
      </div>
    </div>
  );
}
