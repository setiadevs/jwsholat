<!-- src/routes/+page.svelte -->
<script lang="ts">
    import '../app.css';
    import { onMount } from 'svelte';

    // Components
    import LocationInfo from './components/LocationInfo.svelte';
    import CurrentTime from './components/CurrentTime.svelte';
    import NextPrayerAlert from './components/NextPrayerAlert.svelte';
    import PrayerTable from './components/PrayerTable.svelte';

    // Types
    import type { Prayer, PrayerTime, CityData } from './lib/types';

    // --- STATE ---
    let latitude: number | null = null;
    let longitude: number | null = null;
    let prayers: Prayer[] = [];
    let city = '';
    let province = '';
    let isLoading = true;
    let error = '';
    let currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let currentTime = new Date();
    let nextPrayer: { name: string; time: string } | null = null;

    // --- FUNCTIONS ---

    async function fetchPrayerSchedule(lat: number, lng: number) {
        const url = `https://waktu-sholat-huso.vercel.app/prayer?latitude= ${lat}&longitude=${lng}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal mengambil jadwal sholat');

        const data: CityData = await res.json();
        prayers = data.prayers;
        city = data.name;
        province = data.province.name;
    }

    async function reverseGeocode(lat: number, lng: number) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat= ${lat}&lon=${lng}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Gagal mendapatkan informasi lokasi');

        const data = await res.json();
        const address = data.address;

        city = address.city || address.town || address.village || 'Lokasi Tidak Dikenal';
        province = address.state || address.region || address.province || 'Provinsi Tidak Dikenal';
    }

    async function getUserLocation() {
        isLoading = true;
        error = '';
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );

            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;

            await fetchPrayerSchedule(latitude, longitude);
            await reverseGeocode(latitude, longitude);
        } catch (err) {
            console.error(err);
            error = 'Gagal mendeteksi lokasi Anda. Pastikan izin lokasi diaktifkan.';
        } finally {
            isLoading = false;
        }
    }

    function getTodayPrayer(): Prayer | undefined {
        const [y, m, d] = currentDate.split('-');
        const formattedDate = `${y}-${Number(m)}-${Number(d)}`;
        return prayers.find((p) => p.date === formattedDate);
    }

    function getNextPrayer(prayerTimes: PrayerTime): { name: string; time: string } | null {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        for (const [name, timeStr] of Object.entries(prayerTimes)) {
            const [hour, minute] = timeStr.split(':').map(Number);
            if (currentHour < hour || (currentHour === hour && currentMinute < minute)) {
                return { name, time: timeStr };
            }
        }
        return null;
    }

    function checkForPrayerTime(prayerTimes: PrayerTime) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        Object.entries(prayerTimes).forEach(([name, time]) => {
            const [hour, minute] = time.split(':').map(Number);

            if (currentHour === hour && currentMinute === minute) {
                const key = `notified_${now.toDateString()}_${name}`;
                if (!localStorage.getItem(key)) {
                    alert(`Waktu ${name.charAt(0).toUpperCase() + name.slice(1)} Telah Tiba!`);
                    localStorage.setItem(key, 'true');
                }
            }
        });
    }

    $: todayPrayer = prayers.length > 0 && currentDate ? getTodayPrayer() : undefined;

    $: if (todayPrayer) {
        nextPrayer = getNextPrayer(todayPrayer.time);
        checkForPrayerTime(todayPrayer.time);
    }

    onMount(() => {
        getUserLocation();
        setInterval(() => {
            currentTime = new Date();
            currentDate = new Date().toISOString().split('T')[0];
        }, 1000);
    });
</script>

<main class="container mx-auto max-w-lg p-4 mt-8 bg-base-100 rounded-xl shadow-lg">
    <h1 class="text-2xl font-bold mb-2 text-primary">Jadwal Sholat</h1>

    {#if isLoading}
        <p class="text-base-content/70 flex items-center gap-2">
            <span class="loading loading-spinner loading-md"></span>
            Memuat lokasi dan jadwal sholat...
        </p>
    {:else if error}
        <div class="alert alert-error my-2">
            <span>{error}</span>
        </div>
    {:else}
        <LocationInfo {city} {province} />
    {/if}

    <CurrentTime {currentTime} />

    <NextPrayerAlert {nextPrayer} />

    {#if !isLoading && todayPrayer}
        <PrayerTable prayerTimes={todayPrayer.time} />
    {:else if !isLoading}
        <PrayerTable prayerTimes={null} />
    {/if}
</main>