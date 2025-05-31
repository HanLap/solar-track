import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [tailwindcss(), sveltekit()],
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext'
			}
		},
		build: {
			target: 'esnext'
		}
	};
});
