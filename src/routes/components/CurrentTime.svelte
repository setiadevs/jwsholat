<!-- src/routes/components/CurrentTime.svelte -->
<script lang="ts">
    export let currentTime: Date = new Date();
</script>

<p class="mb-2">
    Waktu Saat Ini: <strong class="font-mono">{currentTime.toLocaleTimeString()}</strong>
</p>