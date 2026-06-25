import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">CEPHEUS</h1>
        <p className="text-xl mb-12">Radical Transparency in Electronics Repair</p>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <Link href="/book" className="bg-blue-600 text-white p-4 rounded-lg text-center font-bold hover:bg-blue-700 transition">
            Book a Repair
          </Link>

          <Link href="/track" className="border-2 border-blue-600 text-blue-600 p-4 rounded-lg text-center font-bold hover:bg-blue-50 transition">
            Track My Repair
          </Link>

          <div className="mt-12 text-center">
            <Link href="/admin" className="text-gray-500 hover:underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
