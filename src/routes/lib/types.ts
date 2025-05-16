// src/routes/lib/types.ts

export type PrayerTime = {
    imsak: string;
    subuh: string;
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
};

export type Prayer = {
    id: string;
    date: string;
    time: PrayerTime;
    cityId: string;
};

export type CityData = {
    id: string;
    name: string;
    slug: string;
    provinceId: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    province: {
        id: string;
        name: string;
        slug: string;
    };
    prayers: Prayer[];
};