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
	<button
		type="button"
		@click="pickFiles"
		class="empty-state group flex-1 w-full flex flex-col items-center justify-center gap-y-3 py-6 px-4 relative
		       text-left rounded-lg
		       border-2 border-dashed transition-colors
		       border-accent-700/15 dark:border-accent-300/15
		       hover:border-accent-700/40 dark:hover:border-accent-300/40
		       hover:bg-accent-700/[0.025] dark:hover:bg-accent-300/[0.04]
		       focus-visible:outline-none
		       focus-visible:border-accent-700/55 dark:focus-visible:border-accent-300/55
		       focus-visible:bg-accent-700/[0.04] dark:focus-visible:bg-accent-300/[0.05]">
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
			<div class="status-indicator status-indicator--xl postmark-pulse">
				<div class="circle circle--animated circle-main" />
				<div class="circle circle--animated circle-secondary" />
				<div class="circle circle--animated circle-tertiary" />
			</div>
		</div>

		<h3 class="font-serif text-xl sm:text-2xl tracking-wide text-ink-800 dark:text-ink-100 text-center">
			Ready to receive
		</h3>
		<p class="text-xs sm:text-sm font-serif italic text-ink-500 dark:text-ink-300 text-center">
			Listening for nearby devices
		</p>

		<div
			class="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm
			       text-ink-600 dark:text-ink-200 transition-colors
			       group-hover:text-accent-700 dark:group-hover:text-accent-300
			       group-focus-visible:text-accent-700 dark:group-focus-visible:text-accent-300">
			<Icon name="upload" :size="18" />
			<span>Drop files anywhere or <span class="font-medium underline-offset-2 underline">click to send</span></span>
		</div>
	</button>
</template>

<style scoped>
/* Override the fixed-px pulse so it scales with the postmark wrapper.
   Sized at 15% — the 3.2× sonar peak reaches ~48% of the wrapper,
   inside the inner postmark ring (~69%). */
.postmark-pulse {
	width: 100%;
	height: 100%;
}
.postmark-pulse .circle {
	top: 42.5%;
	left: 42.5%;
	width: 15%;
	height: 15%;
}
</style>
