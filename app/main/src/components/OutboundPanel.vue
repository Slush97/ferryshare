<script setup lang="ts">
import { computed } from 'vue';
import { AppButton, Icon, useTransfersStore } from '../vue_lib';

const transfers = useTransfersStore();

const files = computed(() => transfers.outboundPayload?.Files ?? []);
const fileLabel = computed(() => `${files.value.length} ${files.value.length === 1 ? 'file' : 'files'}`);
</script>

<template>
	<div
		v-if="transfers.outboundPayload"
		class="paper-card mb-4 rounded-md p-4
		       border border-accent-700/30 dark:border-accent-300/30
		       flex flex-row items-center gap-4">
		<div
			class="shrink-0 w-12 h-12 rounded-md flex items-center justify-center
		            bg-accent-500/15 text-accent-700 dark:text-accent-300
		            border border-accent-700/20 dark:border-accent-300/20">
			<Icon name="file" :size="24" />
		</div>
		<div class="flex-1 min-w-0">
			<div class="font-serif text-base text-ink-800 dark:text-ink-100">
				Sharing {{ fileLabel }}
			</div>
			<div class="text-xs font-mono text-ink-500 dark:text-ink-300 truncate">
				{{ files.map((f) => f.split('/').pop()).join(', ') }}
			</div>
		</div>
		<AppButton size="sm" @click="transfers.clearSending()">
			Cancel
		</AppButton>
	</div>
</template>
