<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RunSnapshotTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_read_or_write_a_run_snapshot(): void
    {
        $this->getJson('/runs/current')->assertUnauthorized();
        $this->putJson('/runs/current', ['state' => $this->state()])->assertUnauthorized();
    }

    public function test_a_user_can_create_and_read_their_current_run_snapshot(): void
    {
        $user = User::factory()->create();
        $state = $this->state();

        $this->actingAs($user)
            ->putJson('/runs/current', ['state' => $state])
            ->assertOk()
            ->assertJsonPath('state', $state);

        $this->actingAs($user)
            ->getJson('/runs/current')
            ->assertOk()
            ->assertJsonPath('state', $state);
    }

    public function test_a_user_updates_their_own_snapshot_without_creating_a_second_run(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->putJson('/runs/current', ['state' => $this->state(130)]);
        $this->actingAs($user)->putJson('/runs/current', ['state' => $this->state(95)]);

        $this->assertDatabaseCount('runs', 1);
        $this->actingAs($user)
            ->getJson('/runs/current')
            ->assertJsonPath('state.sim.ember', 95);
    }

    /** @return array<string, mixed> */
    private function state(int $ember = 130): array
    {
        return [
            'version' => 1,
            'savedAt' => 1_789_755_000_000,
            'sim' => [
                'time' => 10,
                'wood' => 40,
                'ember' => $ember,
                'enemies' => [],
                'towers' => [],
                'spawnQueue' => [],
                'spawnTimer' => 0,
                'wave' => 0,
                'phase' => 'building',
                'buildTimer' => 0,
                'kills' => 0,
                'leaks' => 0,
            ],
        ];
    }
}
