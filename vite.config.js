// @ts-nocheck
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	// TODO - determine if necessary? Recommended on svelte site
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
