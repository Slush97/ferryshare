<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentWindow } from '@tauri-apps/api/window';

const isMaximized = ref(false);

async function refreshMaximized() {
	try { isMaximized.value = await getCurrentWindow().isMaximized(); } catch { /* noop */ }
}

onMounted(async () => {
	await refreshMaximized();
	getCurrentWindow().onResized(() => refreshMaximized());
});

async function minimize() { await getCurrentWindow().minimize(); }
async function toggleMax() {
	const w = getCurrentWindow();
	if (await w.isMaximized()) await w.unmaximize();
	else await w.maximize();
	await refreshMaximized();
}
async function close() { await getCurrentWindow().close(); }
</script>

<template>
	<div
		data-tauri-drag-region
		class="select-none flex items-center justify-between h-9 px-3
		       bg-surface-100 dark:bg-surface-900
		       border-b border-surface-200 dark:border-surface-800
		       text-ink-700 dark:text-ink-100
		       shadow-[0_2px_4px_-2px_rgba(58,44,24,0.18)]
		       dark:shadow-[0_2px_6px_-2px_rgba(0,0,0,0.5)]
		       relative z-10">
		<div data-tauri-drag-region class="flex items-center gap-2 text-xs font-serif tracking-wide">
			<div class="w-2 h-2 rounded-full bg-accent-600 dark:bg-accent-300" />
			<span data-tauri-drag-region>RQuickShare</span>
		</div>

		<div class="flex items-center gap-1">
			<button
				type="button"
				class="w-7 h-7 rounded-md inline-flex items-center justify-center
				       hover:bg-accent-700/10 dark:hover:bg-accent-300/10 transition active:scale-95"
				@click="minimize" aria-label="Minimize">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="5.5" width="8" height="1" /></svg>
			</button>
			<button
				type="button"
				class="w-7 h-7 rounded-md inline-flex items-center justify-center
				       hover:bg-accent-700/10 dark:hover:bg-accent-300/10 transition active:scale-95"
				@click="toggleMax" :aria-label="isMaximized ? 'Restore' : 'Maximize'">
				<svg
					v-if="!isMaximized" width="12" height="12" viewBox="0 0 12 12"
					fill="none" stroke="currentColor" stroke-width="1"><rect x="2.5" y="2.5" width="7" height="7" /></svg>
				<svg
					v-else width="12" height="12" viewBox="0 0 12 12"
					fill="none" stroke="currentColor" stroke-width="1">
					<rect x="3.5" y="3.5" width="6" height="6" />
					<path d="M5 3.5 V2 H10 V7 H8.5" />
				</svg>
			</button>
			<button
				type="button"
				class="w-7 h-7 rounded-md inline-flex items-center justify-center
				       hover:bg-red-700 hover:text-ink-50 transition active:scale-95"
				@click="close" aria-label="Close">
				<svg
					width="12" height="12" viewBox="0 0 12 12" fill="none"
					stroke="currentColor" stroke-width="1.2">
					<path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" />
				</svg>
			</button>
		</div>
	</div>
</template>
