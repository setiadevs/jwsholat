<!-- src/routes/components/LocationInfo.svelte -->
<script lang="ts">
    export let city: string = '';
    export let province: string = '';
</script>

{#if city && province}
    <p class="mb-2 text-base-content/80">
        <strong class="badge badge-primary badge-outline">{city}, {province}</strong>
    </p>
{/if}