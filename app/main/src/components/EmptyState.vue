<script setup lang="ts">
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { Icon, useTransfersStore } from '../vue_lib';

const transfers = useTransfersStore();

async function pickFiles() {
	const sel = await openDialog({
		title: 'Select a file to send',
		directory: false,
		multiple: true,
	});
	if (!sel) return;
	const paths = Array.isArray(sel)
		? sel.map((e) => (typeof e === 'string' ? e : (e as { path: string }).path))
		: [sel as string];
	transfers.setOutbound(paths);
	await transfers.ensureDiscovery();
}
</script>

<template>
	<div class="flex-1 flex flex-col items-center justify-center gap-y-3 py-4 relative">
		<!-- Postmark: dashed perforation + inner ring around the pulse -->
		<div class="relative aspect-square w-[clamp(5rem,28vh,14rem)] flex items-center justify-center pointer-events-none">
			<svg
				viewBox="-110 -110 220 220"
				class="absolute inset-0 w-full h-full overflow-visible text-accent-700/45 dark:text-accent-300/40"
				aria-hidden="true">
				<circle
					cx="0" cy="0" r="92" fill="none"
					stroke="currentColor"
					stroke-width="1" stroke-dasharray="2.4 4.8" />
				<circle
					cx="0" cy="0" r="76" fill="none"
					stroke="currentColor"
					stroke-width="0.6" />
			</svg>
			<div class="status-indicator status-indicator--xl relative">
				<div class="circle circle--animated circle-main" />
				<div class="circle circle--animated circle-secondary" />
				<div class="circle circle--animated circle-tertiary" />
			</div>
		</div>

		<h3 class="font-serif text-xl sm:text-2xl tracking-wide text-ink-800 dark:text-ink-100 text-center">
			Ready to receive
		</h3>
		<p class="text-xs sm:text-sm italic text-ink-500 dark:text-ink-300 text-center">
			Listening for nearby devices
		</p>

		<div class="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
			<button
				type="button"
				@click="pickFiles"
				class="paper-card inline-flex items-center gap-2 px-4 py-2 rounded-md
				       text-sm font-medium text-ink-800 dark:text-ink-100
				       hover:border-accent-700/60 dark:hover:border-accent-300/60
				       transition-colors">
				<Icon name="upload" :size="16" class="text-accent-700 dark:text-accent-300" />
				<span>Choose files to share</span>
				<span class="text-accent-700 dark:text-accent-300">→</span>
			</button>
			<span class="text-xs italic text-ink-500 dark:text-ink-300">
				or drop them anywhere
			</span>
		</div>
	</div>
</template>
