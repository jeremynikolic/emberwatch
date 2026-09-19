import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Settlement
                </h2>
            }
        >
            <Head title="Settlement" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="space-y-4 p-6 text-gray-900">
                            <p className="text-lg font-semibold">Your settlement is linked to this account.</p>
                            <p className="text-sm leading-6 text-gray-600">
                                Emberwatch keeps a snapshot in your account whenever the game saves, so you can resume the same settlement from another device.
                            </p>
                            <Link
                                href={route('play')}
                                className="inline-flex items-center rounded-md bg-amber-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                            >
                                Return to the watchfire
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
