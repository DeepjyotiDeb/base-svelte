import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import svg from '@poppanator/sveltekit-svg'

export default defineConfig({
	plugins: [sveltekit(), svg()],
	server: {
		port: 3000,
		open: 'http://localhost:3000'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		// environment: 'jsdom',
		// setupFiles: ['./vitest-setup.ts'],
		globals: true
	}
});

