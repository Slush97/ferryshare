/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const resolve = require('path').resolve

module.exports = {
	darkMode: 'class',
	content: [
		resolve(__dirname, 'index.html'),
		resolve(__dirname, 'src/**/*.{vue,ts}'),
		resolve(__dirname, '../common/vue_lib/src/**/*.{vue,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				serif: ['Lora', 'Georgia', 'serif'],
				sans:  ['Inter', 'system-ui', 'sans-serif'],
				mono:  ['JetBrains Mono', 'ui-monospace', 'monospace'],
			},
			colors: {
				// Sepia ink — replaces the prior emerald accent
				accent: {
					50:  '#fbf3e4',
					100: '#f4e0bf',
					200: '#e6c386',
					300: '#d4a05b',
					400: '#bd7a3a',
					500: '#a05a2b',
					600: '#864324',
					700: '#6a331e',
					800: '#4f2516',
					900: '#341811',
				},
				// Paper sheets — light cream → dark kraft
				surface: {
					0:   '#faf6e9',
					50:  '#f1e8d5',
					100: '#e8dcc1',
					200: '#d4c4a0',
					300: '#bba87f',
					400: '#9d8a63',
					500: '#7d6c4d',
					600: '#5e5039',
					700: '#403628',
					800: '#3b342a',
					900: '#2a241b',
					950: '#1c1814',
				},
				// Ink — text colors
				ink: {
					50:  '#f5efde',
					100: '#e8ddc9',
					300: '#bba87f',
					500: '#5d513d',
					700: '#3b342a',
					800: '#2a2620',
					900: '#1c1814',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
