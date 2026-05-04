<script setup lang="ts">
import { useTransfersStore } from '../vue_lib';
import EmptyState from './EmptyState.vue';

const transfers = useTransfersStore();
</script>

<template>
	<EmptyState v-if="transfers.isEmpty && !transfers.outboundPayload" />
	<h3
		v-else-if="!transfers.isEmpty"
		class="mb-4 font-serif text-xl text-ink-800 dark:text-ink-100">
		Nearby devices
	</h3>
</template>
