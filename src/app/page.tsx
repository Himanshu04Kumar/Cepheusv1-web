// @ts-nocheck
'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Camera, ArrowRight, Globe, Menu, X, ChevronRight, Zap, Award, Users, MessageSquare, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">

      {/* Dynamic Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-slate-950/80 backdrop-blur-2xl py-4 border-white/10' : 'bg-transparent py-6 border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter italic">Cepheus</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-blue-500 transition-colors">Protocol</a>
            <a href="#workflow" className="hover:text-blue-500 transition-colors">Workflow</a>
            <Link href="/track" className="hover:text-white transition-all">Track Registry</Link>
            <Link href="/book" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">Book Service</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors relative z-50">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Enhanced Mobile Nav Overlay */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950 flex flex-col justify-center items-center p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full space-y-4">
               <a onClick={closeMenu} href="#features" className="block w-full text-center py-4 text-2xl font-black uppercase tracking-tighter border-b border-white/5 hover:text-blue-500">The Protocol</a>
               <a onClick={closeMenu} href="#workflow" className="block w-full text-center py-4 text-2xl font-black uppercase tracking-tighter border-b border-white/5 hover:text-blue-500">Our Workflow</a>
               <Link onClick={closeMenu} href="/track" className="block w-full text-center py-4 text-2xl font-black uppercase tracking-tighter border-b border-white/5 hover:text-blue-500">Track Unit</Link>
            </div>
            <Link onClick={closeMenu} href="/book" className="w-full bg-blue-600 text-white text-center py-6 rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-blue-600/40">Start Repair Protocol</Link>
          </div>
        )}
      </nav>

      {/* Hero Section - Highly Dynamic */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-top-4 duration-700">
            <Globe size={12} className="animate-spin-slow" /> Operations: Delhi NCR Active
          </div>

          <div className="space-y-4">
            <h1 className="text-[2.6rem] md:text-8xl font-black uppercase tracking-tighter leading-[0.95] text-white animate-in slide-in-from-bottom-8 duration-700 delay-200">
              Radical <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-200">Transparency</span> <br/>
              Laptop Repair
            </h1>
          </div>

          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4 animate-in fade-in duration-1000 delay-500">
            No more hidden charges. No more fake parts. Experience the new standard of service with live photographic evidence and verifiable logs.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8 max-w-sm mx-auto md:max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <Link href="/book" className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-2 group">
              Start Protocol <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/track" className="w-full md:w-auto bg-slate-900/50 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black active:scale-95 transition-all flex items-center justify-center gap-2">
              Track My Unit
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
             { label: 'Success Rate', val: '99.4%', icon: <Zap size={14}/> },
             { label: 'Booking Fee', val: '₹99', icon: <Award size={14}/> },
             { label: 'TAT Time', val: '24-48h', icon: <Clock size={14}/> },
             { label: 'Warranty', val: 'Up to 1Y', icon: <ShieldCheck size={14}/> }
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center hover:bg-white/[0.05] transition-all hover:-translate-y-1 duration-300">
              <div className="flex justify-center mb-2 text-blue-500 opacity-50">{s.icon}</div>
              <p className="text-2xl md:text-4xl font-black text-white">{s.val}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features - The Cepheus Protocol */}
      <section id="features" className="py-24 px-6 space-y-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white">The Cepheus Protocol</h2>
          <p className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.4em]">Redefining trust in electronics</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Truck className="text-blue-500" />,
              title: 'Secure Pickup',
              desc: 'Logistics partners retrieve your hardware with digital condition reports and geotagged handovers.'
            },
            {
              icon: <Camera className="text-purple-500" />,
              title: 'Visual Proof Log',
              desc: 'Get high-res photographic evidence of every part removed and installed. Total transparency, zero jargon.'
            },
            {
              icon: <ShieldCheck className="text-green-500" />,
              title: 'Verifiable Warranty',
              desc: 'Instantly issued digital warranty certificates with unique IDs valid across our nationwide network.'
            }
          ].map((f, i) => (
            <div key={i} className="group bg-slate-900/20 border border-white/5 p-10 rounded-[3rem] hover:bg-blue-600/5 hover:border-blue-500/20 transition-all duration-700">
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/50">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white group-hover:text-blue-400 transition-colors">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm group-hover:text-slate-300 transition-colors">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6 bg-slate-900/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 text-white">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Repair <span className="text-blue-600 italic">Loop</span></h2>
              <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.3em]">End-to-End Operational Flow</p>
            </div>

            <div className="space-y-10">
              {[
                { step: '01', title: 'Schedule Pickup', body: 'Choose a high-security slot via our registry.' },
                { step: '02', title: 'Live Diagnosis', body: 'Watch the timeline as we assessment the issue.' },
                { step: '03', title: 'Approval Gate', body: 'Review price options and authorize repair.' },
                { step: '04', title: 'Evidence Log', body: 'Photos of new parts are uploaded in real-time.' },
                { step: '05', title: 'Secure Delivery', body: 'Device returned with a digital warranty.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <span className="text-blue-600 font-black text-2xl italic group-hover:scale-125 transition-transform duration-500">{s.step}</span>
                  <div className="space-y-1 border-l-2 border-white/5 pl-8 group-hover:border-blue-600 transition-colors duration-500">
                    <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:translate-x-2 transition-transform duration-500">{s.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[3/4] bg-slate-900 rounded-[4rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-60 group-hover:scale-110 transition-all duration-[2000ms] ease-out"
              alt="Technician repair"
            />
            <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 z-20">
               <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-2xl group-hover:-translate-y-4 transition-transform duration-1000">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
                   <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Live Registry Sync</span>
                 </div>
                 <div className="space-y-1">
                    <h5 className="text-2xl font-black uppercase tracking-tighter text-white">UNIT C1360FEA</h5>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Status: Diagnosing</p>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Technician HK assigned to primary motherboard circuit assessment. Visual log pending.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto space-y-8">
            <MessageSquare className="mx-auto text-blue-600 opacity-50" size={40} />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic">
              "Repairing trust is harder than repairing hardware. We do both."
            </h2>
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-px bg-slate-800" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Cepheus Protocol</p>
               <div className="w-12 h-px bg-slate-800" />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg">C</div>
              <span className="text-2xl font-black uppercase tracking-tighter italic text-white">Cepheus</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
              Revolutionizing electronics repair through the protocol of Radical Transparency. Based in Delhi NCR, serving nationwide.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Operations</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Link href="/book" className="hover:text-blue-500 transition-colors">Book Service</Link>
              <Link href="/track" className="hover:text-blue-500 transition-colors">Track Registry</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Connect</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-blue-500 transition-colors">WhatsApp Lead</a>
              <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn Profile</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-slate-800 border-t border-white/5 pt-12 relative z-10">
          <p>© 2026 CEPHEUS TECHNOLOGY PVT LTD.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
