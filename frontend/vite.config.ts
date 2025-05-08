import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [sveltekit()],
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
