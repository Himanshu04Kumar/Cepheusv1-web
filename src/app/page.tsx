// @ts-nocheck
'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Camera, ArrowRight, Star, Clock, Globe, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">Cepheus</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-blue-500 transition-colors">Protocol</a>
            <a href="#workflow" className="hover:text-blue-500 transition-colors">Workflow</a>
            <Link href="/track" className="bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-all border border-white/10">Track Unit</Link>
            <Link href="/book" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Book Repair</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {menuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-white/5 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
            <Link href="/book" className="block w-full bg-blue-600 text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Book Repair</Link>
            <Link href="/track" className="block w-full bg-slate-900 text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest border border-white/10">Track My Unit</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Globe size={12} /> Live in Delhi NCR
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Radical <br/> <span className="text-blue-600">Transparency</span> <br/> Laptop Repair
          </h1>

          <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            No more hidden charges. No more fake parts. Track every second of your repair journey with live photo evidence and digital logs.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/book" className="w-full md:w-auto bg-blue-600 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2">
              Start Repair Protocol <ArrowRight size={18} />
            </Link>
            <Link href="/track" className="w-full md:w-auto bg-slate-900/50 border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
              Track My Unit
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="px-6 py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
             { label: 'Repair Success', val: '99.4%' },
             { label: 'Booking Fee', val: '₹99' },
             { label: 'Service Time', val: '24-48h' },
             { label: 'Warranty', val: 'Up to 1Y' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-4xl font-black text-white">{s.val}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features - Radical Transparency */}
      <section id="features" className="py-24 px-6 space-y-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">The Cepheus Protocol</h2>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.3em]">Redefining trust in electronics service</p>
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
            <div key={i} className="group bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] hover:bg-blue-600/5 hover:border-blue-500/20 transition-all duration-500">
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] -z-10" />
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-blue-600/20">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none relative z-10">Only ₹99 to Start</h2>
           <p className="text-blue-100 md:text-lg max-w-xl mx-auto font-medium relative z-10">We believe in earning your trust. Pay just ₹99 for pickup and diagnosis. Approve the repair only if you're happy with the evidence.</p>
           <div className="relative z-10 pt-4">
             <Link href="/book" className="inline-flex bg-white text-blue-600 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 gap-2 items-center">Book Now <ChevronRight size={18}/></Link>
           </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Repair <span className="text-blue-600">Timeline</span></h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">From Pickup to Delivery</p>
            </div>

            <div className="space-y-8">
              {[
                { step: '01', title: 'Schedule Pickup', body: 'Choose a slot that works for you.' },
                { step: '02', title: 'Live Diagnosis', body: 'Watch the timeline as we assessment the issue.' },
                { step: '03', title: 'Approval Gate', body: 'Review price options and authorize repair.' },
                { step: '04', title: 'Evidence Log', body: 'Photos of new parts are uploaded in real-time.' },
                { step: '05', title: 'Secure Delivery', body: 'Device returned with a digital warranty.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <span className="text-blue-600 font-black text-xl italic group-hover:scale-125 transition-transform">{s.step}</span>
                  <div className="space-y-1 border-l-2 border-white/5 pl-6 group-hover:border-blue-600 transition-colors">
                    <h4 className="font-black uppercase tracking-tight text-white">{s.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[3/4] bg-slate-900 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
              alt="Technician repair"
            />
            <div className="absolute inset-0 flex items-center justify-center p-12">
               <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-4 shadow-2xl">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                   <span className="text-[10px] font-black uppercase text-green-500">Live Registry Update</span>
                 </div>
                 <h5 className="text-xl font-black uppercase tracking-tight">C1360FEA Unit</h5>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Technician assigned to motherboard circuit assessment.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">Cepheus</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
              Revolutionizing electronics repair through the protocol of Radical Transparency. Based in Delhi NCR, serving nationwide.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Operations</h4>
            <div className="flex flex-col gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Link href="/book" className="hover:text-blue-500">Book Service</Link>
              <Link href="/track" className="hover:text-blue-500">Track Registry</Link>
              <a href="#" className="hover:text-blue-500">Business Portal</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Connect</h4>
            <div className="flex flex-col gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <a href="#" className="hover:text-blue-500">WhatsApp Lead</a>
              <a href="#" className="hover:text-blue-500">Support Hub</a>
              <a href="#" className="hover:text-blue-500">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
          <p>© 2026 CEPHEUS TECHNOLOGY PVT LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#">Privacy Protocol</a>
            <a href="#">Service Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
