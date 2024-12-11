import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},
	onwarn: (warning, handler) => {
		// suppress warnings on `vite dev` and `vite build`; but even without this, things still work
		if (warning.code === 'a11y-click-events-have-key-events') return;
		if (warning.code === 'a11y-no-static-element-interactions') return;
		handler(warning);
	}
};

export default config;
