<?php

namespace App\Http\Controllers;

use App\Models\Run;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RunSnapshotController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $run = Run::query()->whereBelongsTo($request->user())->first();

        return response()->json([
            'state' => $run?->state,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $state = $request->validate([
            'state' => ['required', 'array'],
            'state.version' => ['required', 'integer', 'in:1'],
            'state.savedAt' => ['required', 'integer', 'min:0'],
            'state.sim' => ['required', 'array'],
        ])['state'];

        $encoded = json_encode($state, JSON_THROW_ON_ERROR);

        if (strlen($encoded) > 100_000) {
            throw ValidationException::withMessages([
                'state' => 'A settlement snapshot may not exceed 100 KB.',
            ]);
        }

        $run = Run::query()->updateOrCreate(
            ['user_id' => $request->user()->getAuthIdentifier()],
            ['state' => $state],
        );

        return response()->json([
            'state' => $run->state,
        ]);
    }
}
