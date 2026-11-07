import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 text-center">
      <div className="font-mono text-xs text-ink/40 mb-4 stamp-text">ERROR · 404 NOT FOUND</div>
      <div className="font-display text-8xl font-extrabold mb-4 text-signal tracking-tight">404</div>
      <h1 className="font-display text-3xl font-bold mb-4">This ticket stub doesn&apos;t exist.</h1>
      <p className="text-ink/60 mb-8 max-w-md">
        The page you&apos;re looking for has been torn off, moved, or never existed. Head back to the main stage.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="tactile-btn-signal px-6 py-3 font-semibold">
          Back to Home
        </Link>
        <Link href="/blog" className="tactile-btn px-6 py-3 font-semibold bg-ivory">
          Read the Blog
        </Link>
      </div>
    </main>
  );
}
