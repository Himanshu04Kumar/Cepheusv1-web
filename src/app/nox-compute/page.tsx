// @ts-nocheck
'use client';

import Link from 'next/link';

export default function NoxComputePage() {
  return (
    <div className="min-h-screen bg-[#030407] text-[#EDEFF4] font-sans selection:bg-[#6FE7FF]/30 overflow-x-hidden relative">

      {/* Starfield Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 8% 12%, rgba(255,255,255,0.75), transparent),
            radial-gradient(1px 1px at 22% 68%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 35% 22%, rgba(255,255,255,0.65), transparent),
            radial-gradient(1px 1px at 48% 84%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 61% 38%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 74% 14%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1px 1px at 83% 62%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 91% 91%, rgba(255,255,255,0.5), transparent)
          `,
          backgroundSize: 'cover'
        }} />
      </div>

      {/* HUD Brackets */}
      <div className="fixed top-[22px] left-[22px] w-[22px] h-[22px] border-t border-l border-white/16 z-10 pointer-events-none hidden md:block" />
      <div className="fixed top-[22px] right-[22px] w-[22px] h-[22px] border-t border-r border-white/16 z-10 pointer-events-none hidden md:block" />
      <div className="fixed bottom-[22px] left-[22px] w-[22px] h-[22px] border-b border-l border-white/16 z-10 pointer-events-none hidden md:block" />
      <div className="fixed bottom-[22px] right-[22px] w-[22px] h-[22px] border-b border-r border-white/16 z-10 pointer-events-none hidden md:block" />

      {/* Telemetry */}
      <div className="fixed bottom-[26px] left-[54px] font-mono text-[10px] tracking-[0.12em] text-[#454A58] z-10 pointer-events-none hidden md:block">
        STATUS · PRE-LAUNCH
      </div>

      <Link href="/" className="fixed top-[26px] left-[54px] font-mono text-[10px] tracking-[0.12em] text-[#767C8C] hover:text-[#6FE7FF] transition-all z-20 no-underline opacity-60 hover:opacity-100 uppercase">
        ← CEPHEUS
      </Link>

      <div className="relative z-10">

        {/* HERO */}
        <section className="min-h-[96vh] flex flex-col items-center justify-center text-center p-6 relative">

          {/* Orbital Field Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] opacity-30 pointer-events-none">
             <div className="absolute inset-0 border border-white/10 rounded-full" />
             <div className="absolute inset-[80px] border border-white/5 rounded-full" />
             <div className="absolute inset-[160px] border border-white/10 rounded-full" />
             <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -ml-0.5 w-1 h-1 bg-[#6FE7FF] rounded-full shadow-[0_0_10px_#6FE7FF]" />
             </div>
             <div className="absolute inset-[80px] animate-spin-reverse-slow">
                <div className="absolute top-0 left-1/2 -ml-0.5 w-1 h-1 bg-[#FF6B4A] rounded-full shadow-[0_0_10px_#FF6B4A]" />
             </div>
          </div>

          <p className="font-mono text-[11px] tracking-[0.32em] text-[#767C8C] uppercase mb-8">CEPHEUS</p>
          <h1 className="font-black text-[60px] md:text-[118px] tracking-[0.03em] leading-none m-0">NOX</h1>
          <p className="font-mono text-[13px] md:text-[15px] tracking-[0.4em] text-[#6FE7FF] uppercase mt-4 mb-8">Compute</p>
          <p className="text-base leading-relaxed text-[#767C8C] max-w-[440px]">
            Enterprise infrastructure, advised and installed.<br/>
            <strong className="text-white font-medium">Currently in private build.</strong>
          </p>
        </section>

        <div className="max-w-[720px] mx-auto px-6">

          {/* WHAT WE DO */}
          <section className="py-28">
            <div className="font-mono text-[11px] tracking-[0.26em] text-[#454A58] uppercase mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-white/10">
              What we're building
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">Two ways in.</h2>
            <p className="text-[#767C8C] text-sm leading-relaxed max-w-[480px] mb-12">A light preview — full detail lands at launch.</p>

            <div className="grid md:grid-cols-2 gap-[1px] bg-white/10 border border-white/10">
               <div className="bg-[#090B10] p-8 hover:bg-[#0D1017] transition-colors group">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[#6FE7FF] uppercase mb-6">Consult</p>
                  <h3 className="text-xl font-semibold mb-2">Advisory</h3>
                  <p className="text-[13.5px] leading-relaxed text-[#767C8C]">We help you decide what compute to buy, and how to set it up right, networking, power, cooling, the parts nobody warns you about.</p>
               </div>
               <div className="bg-[#090B10] p-8 hover:bg-[#0D1017] transition-colors group">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[#6FE7FF] uppercase mb-6">Provision</p>
                  <h3 className="text-xl font-semibold mb-2">Deployment</h3>
                  <p className="text-[13.5px] leading-relaxed text-[#767C8C]">We source and install the hardware itself, tested and warrantied, so your team can start running workloads instead of chasing vendors.</p>
               </div>
            </div>

            <div className="mt-14 flex justify-center">
               <div className="font-mono text-[11px] tracking-[0.24em] text-[#767C8C] border border-white/16 px-5 py-2.5 flex items-center gap-2 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  Coming Soon
               </div>
            </div>
          </section>

          {/* NOTIFY */}
          <section className="py-28 border-t border-white/10">
             <div className="font-mono text-[11px] tracking-[0.26em] text-[#454A58] uppercase mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-white/10">
              Stay in the loop
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">Get notified at launch.</h2>
            <p className="text-[#767C8C] text-sm leading-relaxed max-w-[480px] mb-12">Leave your email, and we'll reach out the moment we're live — no spam, just one message when it matters.</p>

            <div className="bg-[#090B10] border border-white/10 p-10 space-y-10">
               <form className="flex flex-col sm:flex-row gap-2" onSubmit={e => e.preventDefault()}>
                  <input type="email" placeholder="you@company.com" className="flex-1 bg-[#030407] border border-white/10 p-3.5 text-sm outline-none focus:border-[#6FE7FF] transition-colors" required />
                  <button className="font-mono text-[11px] tracking-[0.14em] uppercase border border-[#6FE7FF] text-[#6FE7FF] p-3.5 hover:bg-[#6FE7FF] hover:text-[#030407] transition-all">Notify me</button>
               </form>

               <div className="flex items-center gap-4 text-[#454A58] font-mono text-[10px] tracking-[0.16em] uppercase after:content-[''] after:flex-1 after:h-px after:bg-white/10 before:content-[''] before:flex-1 before:h-px before:bg-white/10">
                  or tell us what you need
               </div>

               <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="font-mono text-[11px] tracking-[0.12em] text-[#767C8C] uppercase block mb-2.5">Name / Organisation</label>
                    <input type="text" placeholder="Enter full name or entity title" className="w-full bg-[#030407] border border-white/10 p-3.5 text-sm outline-none focus:border-[#6FE7FF] transition-colors" required />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] tracking-[0.12em] text-[#767C8C] uppercase block mb-2.5">What are you looking for?</label>
                    <textarea placeholder="A few lines on your compute needs, timeline, or questions." className="w-full bg-[#030407] border border-white/10 p-3.5 text-sm outline-none focus:border-[#6FE7FF] transition-colors min-h-[90px]" required />
                  </div>
                  <button className="font-mono text-[11px] tracking-[0.14em] uppercase border border-[#6FE7FF] text-[#6FE7FF] px-6 py-3.5 hover:bg-[#6FE7FF] hover:text-[#030407] transition-all">
                    Send Requirements
                  </button>
               </form>
               <p className="text-[12px] text-[#454A58] italic">This reaches our team directly, we read every submission.</p>
            </div>
          </section>

          {/* ONBOARDING */}
          <section className="py-28 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-7">
             <div className="max-w-[440px]">
                <div className="font-mono text-[11px] tracking-[0.26em] text-[#454A58] uppercase mb-5 flex items-center gap-3">
                  Founding bench
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">We're onboarding early.</h2>
                <p className="text-[#767C8C] text-[13.5px] leading-relaxed">Looking for people who already think in racks, watts, and uptime, hardware backgrounds, hands-on experience, and a high bar for how infrastructure should be built.</p>
             </div>
             <Link href="#" className="font-mono text-[12px] tracking-[0.08em] text-[#6FE7FF] border border-[#6FE7FF] px-[18px] py-[12px] hover:bg-[#6FE7FF] hover:text-[#030407] transition-all no-underline whitespace-nowrap">
                Reach out →
              </Link>
          </section>

        </div>

        <footer className="py-12 md:py-16 text-center border-t border-white/10 opacity-40">
          <p className="font-mono text-[10px] tracking-[0.1em] text-[#454A58] uppercase">NOX COMPUTE — CEPHEUS CONCEPT — IN PRIVATE BUILD</p>
        </footer>

      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 90s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
