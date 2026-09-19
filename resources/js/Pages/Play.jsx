import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { mountGame } from '../game/main';
import { restoreServerRun, RUN_SAVED_EVENT } from '../game/persistence';

function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

export default function Play({ auth }) {
    const canvasRef = useRef(null);
    const [error, setError] = useState(null);
    const userId = auth.user?.id ?? null;

    useEffect(() => {
        const canvas = canvasRef.current;
        let active = true;
        let game = null;
        let saving = false;
        let queuedState = null;
        const abort = new AbortController();

        const sync = async () => {
            if (saving || !queuedState) return;

            saving = true;

            while (queuedState && active) {
                const state = queuedState;
                queuedState = null;

                try {
                    await fetch('/runs/current', {
                        method: 'PUT',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken(),
                        },
                        body: JSON.stringify({ state }),
                    });
                } catch {
                    // Local storage remains the immediate source of truth while
                    // a transient network failure prevents account sync.
                }
            }

            saving = false;
        };

        const onRunSaved = (event) => {
            queuedState = event.detail;
            void sync();
        };

        const boot = async () => {
            if (!canvas) return;

            if (userId) {
                try {
                    const response = await fetch('/runs/current', {
                        headers: { Accept: 'application/json' },
                        credentials: 'same-origin',
                        signal: abort.signal,
                    });

                    if (response.ok) {
                        const payload = await response.json();
                        restoreServerRun(payload.state);
                    }
                } catch (cause) {
                    if (cause.name !== 'AbortError') {
                        setError('Cloud settlement could not be loaded. Playing from this device instead.');
                    }
                }

                window.addEventListener(RUN_SAVED_EVENT, onRunSaved);
            }

            if (active) {
                game = mountGame(canvas, (cause) => {
                    setError(cause instanceof Error ? cause.message : String(cause));
                });
            }
        };

        void boot();

        return () => {
            active = false;
            abort.abort();
            window.removeEventListener(RUN_SAVED_EVENT, onRunSaved);
            game?.dispose();
        };
    }, [userId]);

    return (
        <>
            <Head title="Emberwatch" />
            <main className="min-h-screen bg-[#080d17] px-3 py-5 text-slate-100 sm:px-6 sm:py-8">
                <section className="mx-auto max-w-7xl">
                    <header className="mb-4 flex items-center justify-between border-b border-amber-400/35 pb-3 font-mono text-xs tracking-[0.18em] text-slate-400">
                        <span>EMBERWATCH</span>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    <span className="hidden text-slate-500 sm:inline">{auth.user.name}</span>
                                    <Link href={route('dashboard')} className="text-amber-200 hover:text-amber-100">Settlement</Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="hover:text-slate-200">Log in</Link>
                                    <Link href={route('register')} className="text-amber-200 hover:text-amber-100">Claim a settlement</Link>
                                </>
                            )}
                        </nav>
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
                            {error}
                        </p>
                    ) : (
                        <p className="mt-3 font-mono text-xs tracking-wide text-slate-500">
                            {auth.user
                                ? 'This settlement saves to your Emberwatch account and this device.'
                                : 'Play locally, or claim a settlement to keep it across devices.'}
                        </p>
                    )}
                </section>
            </main>
        </>
    );
}
