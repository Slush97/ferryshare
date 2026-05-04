<script setup lang="ts">
import { useTransfersStore } from '../vue_lib';
import EmptyState from './EmptyState.vue';

const transfers = useTransfersStore();
</script>

<template>
	<EmptyState v-if="transfers.isEmpty && !transfers.outboundPayload" />
	<div
		v-else-if="transfers.isEmpty && transfers.outboundPayload"
		class="flex-1 flex flex-col items-center justify-center gap-y-3 py-4 text-center">
		<div class="status-indicator">
			<div class="circle circle--animated circle-main" />
			<div class="circle circle--animated circle-secondary" />
			<div class="circle circle--animated circle-tertiary" />
		</div>
		<h3 class="font-serif text-xl tracking-wide text-ink-800 dark:text-ink-100">
			Searching for nearby devices
		</h3>
		<p class="text-xs sm:text-sm italic text-ink-500 dark:text-ink-300 max-w-sm">
			Open Quick Share on the receiving device and make sure it's visible on the same network.
		</p>
	</div>
	<h3
		v-else-if="!transfers.isEmpty"
		class="mb-4 font-serif text-xl text-ink-800 dark:text-ink-100">
		Nearby devices
	</h3>
</template>
