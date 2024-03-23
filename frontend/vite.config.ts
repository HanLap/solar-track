import { sveltekit } from '@sveltejs/kit/vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [sveltekit(), purgeCss()],
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext',
			},
		},
		build: {
			target: 'esnext',
		},
	};
});
