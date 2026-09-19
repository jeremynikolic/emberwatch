<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RunSnapshotController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Play');
})->name('play');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/runs/current', [RunSnapshotController::class, 'show'])->name('runs.current.show');
    Route::put('/runs/current', [RunSnapshotController::class, 'update'])->name('runs.current.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
