import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-background text-foreground transition-colors relative">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm flex flex-col">
        <h1 className="text-5xl md:text-7xl font-black text-primary mb-4 tracking-tighter uppercase">CEPHEUS</h1>
        <p className="text-lg md:text-xl mb-12 text-muted-foreground text-center max-w-lg leading-relaxed">
          Radical Transparency in Electronics Repair. <br className="hidden md:inline"/> Doorstep pickup, visual proof, and verifiable warranty.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <Link href="/book" className="bg-primary text-primary-foreground p-4 rounded-xl text-center font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            Book a Repair
          </Link>

          <Link href="/track" className="border-2 border-primary/20 text-primary p-4 rounded-xl text-center font-bold hover:bg-primary/5 transition-all">
            Track My Repair
          </Link>

          <div className="mt-12 text-center flex flex-col gap-4">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest font-bold transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
