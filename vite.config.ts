import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

import Terminal from 'vite-plugin-terminal';
export default defineConfig({
	plugins: [
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		Terminal(),
		VitePWA({
			registerType: undefined,
			injectRegister: null,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: 'workout',
				short_name: 'workout',
				description: 'workout',
				theme_color: '#2b7fff',
			},

			devOptions: {
				enabled: false,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
		}),
	],
});
