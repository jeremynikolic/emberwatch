import { useEffect, useRef, useState } from 'react';
import { mountGame, type MountedGame } from './game/main';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let game: MountedGame | null = mountGame(canvas, cause => {
      setError(cause instanceof Error ? cause.message : String(cause));
    });
    return () => { game?.dispose(); game = null; };
  }, []);

  return (
    <main className="min-h-screen bg-[#080d17] px-3 py-5 text-slate-100 sm:px-6 sm:py-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-4 flex items-center justify-between border-b border-amber-400/35 pb-3 font-mono text-xs tracking-[0.18em] text-slate-400">
          <span>EMBERWATCH</span>
          <span className="text-amber-200">IDLE DEFENCE PROTOTYPE</span>
        </header>
        <div className="overflow-hidden border-4 border-[#121b2b] bg-[#0c1422] shadow-[0_0_0_2px_#825f32,0_24px_80px_#000b]">
          <canvas
            ref={canvasRef}
            id="game"
            width="1280"
            height="720"
            aria-label="Emberwatch tower-defense game"
            className="mx-auto block max-h-[calc(100vh-9rem)] w-auto max-w-full [image-rendering:pixelated]"
          />
        </div>
        {error ? (
          <p role="alert" className="mt-3 border border-red-400/40 bg-red-950/40 p-3 font-mono text-sm text-red-200">
            Game assets failed to load: {error}
          </p>
        ) : (
          <p className="mt-3 font-mono text-xs tracking-wide text-slate-500">
            Build a defence, leave it running, return to outcomes, then iterate.
          </p>
        )}
      </section>
    </main>
  );
}
