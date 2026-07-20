// @ts-nocheck
'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Camera, ArrowRight, Globe, Menu, X, ChevronRight, Zap, Award, Users, MessageSquare, Clock, CheckCircle2, Instagram, Linkedin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#09090b] font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#fbfbfa]/80 backdrop-blur-xl py-3 border-black/5' : 'bg-transparent py-5 border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#09090b]">Cepheus</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/book" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10">Book Now</Link>
            <button onClick={() => setMenuOpen(true)} className="p-2 text-[#09090b] hover:opacity-70 transition-opacity">
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-[2px] bg-current rounded-full" />
                <span className="w-full h-[2px] bg-current rounded-full" />
                <span className="w-full h-[2px] bg-current rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setMenuOpen(false)} />
          <div className="relative w-full max-w-[360px] bg-white h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12 border-b border-black/5 pb-4">
              <span className="text-[10px] font-black tracking-widest text-[#6b6c76]">MENU</span>
              <button onClick={() => setMenuOpen(false)} className="text-2xl hover:text-indigo-600 transition-colors">&times;</button>
            </div>

            <div className="flex-1 space-y-10 overflow-y-auto">
              <NavGroup label="Services" links={[
                { label: 'Book a Repair', href: '/book' },
                { label: 'Track Your Repair', href: '/track' }
              ]} />
              <NavGroup label="Partnerships" links={[
                { label: 'Institutional Solutions', href: '#' }
              ]} />
              <NavGroup label="Resources" links={[
                { label: 'FAQs', href: '#' },
                { label: 'Warranty Policy', href: '#' }
              ]} />
              <NavGroup label="Support" links={[
                { label: 'Get in Touch', href: '#' }
              ]} />
            </div>

            <div className="mt-auto pt-8 border-t border-black/5 border-dashed">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Fully Live Across Delhi
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        <div className="space-y-8 text-left animate-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-[2.75rem] md:text-[4rem] font-extrabold leading-[1.1] tracking-tight text-[#09090b]">
            Fix your device.<br/>
            <span className="bg-gradient-to-b from-[#09090b] to-[#4b5563] bg-clip-text text-transparent">Without the anxiety.</span>
          </h1>

          <p className="text-[13px] md:text-sm font-semibold text-[#6b7280] tracking-wide uppercase">
            Guaranteed 24-Hour Turnaround • Absolute Data Privacy • Fully Active Across Delhi
          </p>

          <div className="flex flex-wrap gap-2">
            <PillarTag label="Doorstep Inspection" />
            <PillarTag label="Verified Parts" />
            <PillarTag label="Live Tracking Log" />
            <PillarTag label="Your Data Stays Yours" />
            <PillarTag label="No Fix, No Fee" />
            <PillarTag label="1Y Warranty" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/book" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-600/20 text-center">Book a Repair</Link>
            <Link href="/track" className="bg-white text-[#09090b] border border-black/5 px-8 py-4 rounded-lg font-bold text-sm hover:bg-slate-50 hover:border-black/10 hover:-translate-y-1 transition-all text-center">Track Your Repair</Link>
          </div>
        </div>

        {/* Mockup Preview */}
        <div className="relative group hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="bg-white border border-black/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]">
            <div className="bg-black/[0.01] border-b border-black/5 px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f0b4ab]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f3d9a4]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#b8e0c4]" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest ml-2">cepheus-tracking-portal</span>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-black/5 border-dashed pb-4">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">ACTIVE REPAIR:</span>
                <span className="text-[10px] font-mono font-bold text-indigo-600">DIAGNOSTIC VIEW</span>
              </div>

              <div className="space-y-6">
                <MockupStep title="01 / Secure Intake Logged" meta="Verified at door • Complete" done />
                <MockupStep title="02 / Live Component Diagnosis" meta="Teardown analysis in progress" active />
              </div>

              <div className="bg-black/[0.01] border border-black/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>ESTIMATED TIME:</span>
                  <span className="text-[#09090b] font-bold">24 Hours</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>PARTS STATUS:</span>
                  <span className="text-[#b45309] font-bold uppercase">PENDING PRE-APPROVAL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center bg-[#eaeaea] border border-black/5 px-4 py-2 rounded-full w-max mx-auto shadow-sm">
            <span className="bg-white text-[10px] font-black px-2 py-0.5 rounded-full mr-3 shadow-sm uppercase tracking-tighter">Now Live</span>
            <span className="text-[11px] font-bold text-[#09090b]">Computers & Laptops</span>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <main className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-[#09090b]">How Do We Work?</h2>
          <p className="text-sm text-[#6b6c76] mt-1">Simple. Fast. Reliable.</p>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
             <WorkflowStep number="01" title="Book a Repair" text="Choose a convenient pickup slot from your home or campus." />
             <WorkflowStep number="02" title="Doorstep Inspection" text="We verify basic device conditions at your door and log it." />
             <WorkflowStep number="03" title="Live Diagnosis" text="Review itemized costs and approve the fix at your Tracking Portal." />
             <WorkflowStep number="04" title="Documented Fix" text="Watch your repair unfold with live photos and parts verification." />
             <WorkflowStep number="05" title="Secure Return" text="Safe delivery with up to 1-year warranty and total data privacy." />
          </div>
        </div>

        {/* B2B Banner */}
        <div className="mt-16 p-10 border border-black/5 border-dashed rounded-xl bg-white flex flex-col lg:flex-row justify-between items-center gap-8">
           <div className="max-w-2xl text-center lg:text-left">
              <h4 className="text-lg font-bold text-[#09090b]">Managing devices for a school or office?</h4>
              <p className="text-sm text-[#4b5563] mt-2 leading-relaxed">We provide dedicated frameworks for institutional clients—featuring itemized audit trails, pre-approved pricing lists, and consolidated monthly invoicing.</p>
           </div>
           <button className="bg-white text-[#09090b] border border-black/10 px-6 py-3 rounded-lg font-bold text-[13px] whitespace-nowrap hover:bg-slate-50 transition-all">Explore Enterprise Solutions &rarr;</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f4] border-t border-black/5 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 pb-20">
            <div className="md:col-span-1 space-y-6">
              <span className="text-lg font-black tracking-widest text-[#09090b]">CEPHEUS</span>
              <p className="text-sm text-[#4b5563] leading-relaxed">Trust, at Infrastructure Scale.<br/>Your device data is yours. We never sell or share it.</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:col-span-3">
              <FooterCol title="Operations" links={['Book a Repair', 'Track Your Repair', 'Institutional Solutions']} />
              <FooterCol title="Ecosystem" links={['NOX Labs', 'NOX Compute']} />
              <FooterCol title="Framework" links={['Privacy Policy', 'Terms of Service', 'Audit Guidelines']} />
            </div>
          </div>

          <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-mono text-[#6b6c76]">&copy; 2026 Cepheus. All rights reserved.</p>
            <div className="flex gap-4">
              <SocialBtn icon={<Instagram size={16}/>} />
              <SocialBtn icon={<Linkedin size={16}/>} />
              <SocialBtn icon={<Mail size={16}/>} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PillarTag({ label }) {
  return (
    <div className="bg-white border border-black/5 text-[#09090b] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 hover:-translate-y-0.5 hover:border-black/10 transition-all cursor-default">
      <span className="text-indigo-600">✓</span> {label}
    </div>
  );
}

function MockupStep({ title, meta, done, active }) {
  return (
    <div className="flex gap-4">
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${done ? 'bg-slate-300' : active ? 'bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-slate-200'}`} />
      <div>
        <p className="text-[11px] font-bold text-[#09090b]">{title}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{meta}</p>
      </div>
    </div>
  );
}

function WorkflowStep({ number, title, text }) {
  return (
    <div className="space-y-4">
      <span className="text-[11px] font-mono font-bold text-slate-400">{number}</span>
      <h3 className="text-[13px] font-bold text-[#09090b]">{title}</h3>
      <p className="text-[12px] text-[#4b5563] leading-relaxed">{text}</p>
    </div>
  );
}

function NavGroup({ label, links }) {
  return (
    <div className="space-y-4">
      <span className="text-[10px] font-black text-[#6b6c76] tracking-widest uppercase">{label}</span>
      <div className="flex flex-col gap-3">
        {links.map((link, i) => (
          <Link key={i} href={link.href} className="text-lg font-bold text-[#09090b] hover:text-indigo-600 transition-colors">{link.label}</Link>
        ))}
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-4">
      <h5 className="text-[11px] font-black text-[#09090b] uppercase tracking-wider">{title}</h5>
      <div className="flex flex-col gap-2.5">
        {links.map((l, i) => (
          <a key={i} href="#" className="text-[12px] text-[#4b5563] hover:text-[#09090b] transition-colors">{l}</a>
        ))}
      </div>
    </div>
  );
}

function SocialBtn({ icon }) {
  return (
    <button className="w-9 h-9 rounded-lg bg-black/[0.03] border border-black/5 flex items-center justify-center text-[#4b5563] hover:bg-white hover:text-indigo-600 hover:border-black/10 hover:-translate-y-1 transition-all">
      {icon}
    </button>
  );
}
