<!-- src/routes/components/PrayerTable.svelte -->
<script lang="ts">
    import type { PrayerTime } from '../lib/types';

    export let prayerTimes: PrayerTime | null = null;
</script>

{#if prayerTimes}
    <table class="table table-zebra w-full mb-4">
        <thead>
            <tr>
                <th class="bg-base-200">Ibadah</th>
                <th class="bg-base-200">Waktu</th>
            </tr>
        </thead>
        <tbody>
            {#each Object.entries(prayerTimes) as [name, time]}
                <tr>
                    <td class="capitalize">{name}</td>
                    <td class="font-mono">{time}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <div class="alert alert-warning">
        <p>Tidak ada jadwal sholat untuk tanggal ini.</p>
    </div>
{/if}