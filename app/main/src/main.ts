import { devtools } from '@vue/devtools'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './vue_lib/assets/main.postcss'

import App from './App.vue'

// Synchronous system-preference apply so we don't flash light on dark systems
// before the persisted theme finishes loading.
;(() => {
	try {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (prefersDark) {
			document.documentElement.classList.add('dark');
			document.documentElement.style.colorScheme = 'dark';
		}
	} catch { /* noop */ }
})();

if (import.meta.env.DEV) {
	devtools.connect('http://localhost', 8098)
}

const pinia = createPinia();
const app = createApp(App)

app.use(pinia);

app.mount('#app')
