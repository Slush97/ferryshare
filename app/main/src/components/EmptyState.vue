<script setup lang="ts">
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { useTransfersStore } from '../vue_lib';

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
	<div class="empty-state flex-1 flex flex-col items-center justify-center gap-y-3 py-4 relative">
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

		<button
			type="button"
			@click="pickFiles"
			class="drop-hint mt-3 inline-flex items-center justify-center
			       text-xs sm:text-sm text-ink-600 dark:text-ink-200">
			<span class="drop-hint__text">
				Drop files anywhere to send, or
				<span class="drop-hint__action text-accent-700 dark:text-accent-300">click to browse</span>
			</span>
		</button>
	</div>
</template>

<style scoped>
.drop-hint {
	cursor: pointer;
	background: transparent;
	border: 0;
	padding: 0.25rem 0.5rem;
	opacity: 0;
	transition: opacity 0.2s ease;
}
.empty-state:hover .drop-hint,
.drop-hint:focus-visible {
	opacity: 1;
}
.drop-hint:focus-visible {
	outline: 2px solid currentColor;
	outline-offset: 4px;
	border-radius: 4px;
}
.drop-hint__action {
	font-weight: 500;
	box-shadow: inset 0 -1px 0 currentColor;
}
</style>
