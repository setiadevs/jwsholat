<!-- src/routes/components/NextPrayerAlert.svelte -->
<script lang="ts">
    export let nextPrayer: { name: string; time: string } | null = null;
</script>

{#if nextPrayer}
    <div class="alert alert-info mb-4">
        <strong>Sholat Berikutnya:</strong>
        {nextPrayer.name.charAt(0).toUpperCase() + nextPrayer.name.slice(1)} - {nextPrayer.time}
    </div>
{/if}