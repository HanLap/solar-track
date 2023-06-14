import path from 'node:path';
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs';
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config}*/
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		path.join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],

	theme: {
		extend: {}
	},

	plugins: [forms, ...skeleton()]
};

module.exports = config;
