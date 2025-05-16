import adapter from '@sveltejs/adapter-static';

export default {
    kit: {
        // Set output folder menjadi "dist"
        adapter: adapter({
            pages: 'dist',
            assets: 'dist',
            fallback: 'index.html', // fallback untuk SPA
            strict: false // abaikan error prerender
        }),
		paths: {
			base: '/jwsholat' // base path untuk deploy ke GitHub Pages
		},
        // Prerender semua halaman yang bisa diprerender
        prerender: {
            entries: ['*'] // coba prerender semua route
        }
    }
};