import { defineStore } from 'pinia';
import { settingsStore } from '../storage';

export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_KEY = 'theme_mode';

function systemPrefersDark(): boolean {
	return typeof window !== 'undefined'
		&& !!window.matchMedia
		&& window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyToDocument(isDark: boolean) {
	const root = document.documentElement;
	if (isDark) root.classList.add('dark');
	else root.classList.remove('dark');
	root.style.colorScheme = isDark ? 'dark' : 'light';
}

export const useThemeStore = defineStore('theme', {
	state: () => ({
		mode: 'system' as ThemeMode,
		systemDark: systemPrefersDark(),
		_mediaListener: null as ((e: MediaQueryListEvent) => void) | null,
	}),
	getters: {
		isDark(): boolean {
			return this.mode === 'dark' || (this.mode === 'system' && this.systemDark);
		},
	},
	actions: {
		async hydrate() {
			try {
				const store = await settingsStore();
				const saved = await store.get<ThemeMode>(THEME_KEY);
				if (saved === 'system' || saved === 'light' || saved === 'dark') {
					this.mode = saved;
				}
			} catch (e) {
				console.error('theme hydrate', e);
			}
			this.attachSystemListener();
			applyToDocument(this.isDark);
		},
		attachSystemListener() {
			if (this._mediaListener || typeof window === 'undefined' || !window.matchMedia) return;
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			const listener = (e: MediaQueryListEvent) => {
				this.systemDark = e.matches;
				applyToDocument(this.isDark);
			};
			mq.addEventListener('change', listener);
			this._mediaListener = listener;
		},
		async setMode(mode: ThemeMode) {
			this.mode = mode;
			applyToDocument(this.isDark);
			try {
				const store = await settingsStore();
				await store.set(THEME_KEY, mode);
				await store.save();
			} catch (e) {
				console.error('theme persist', e);
			}
		},
	},
});
