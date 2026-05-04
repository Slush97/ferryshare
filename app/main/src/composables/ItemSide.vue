<script setup lang="ts">
import { computed } from 'vue';
import { DisplayedItem, Icon, IconName, useTransfersStore } from '../vue_lib';

const transfers = useTransfersStore();
const props = defineProps<{ item: DisplayedItem }>();

const icon = computed<IconName>(() => {
	if (props.item.state === 'Finished') return 'check-double';
	switch (props.item.deviceType) {
	case 'Laptop': return 'laptop';
	case 'Phone': return 'phone';
	case 'Tablet': return 'tablet';
	default: return 'computer';
	}
});

const isErrorState = computed(
	() =>
		!!props.item.state &&
		['Cancelled', 'Rejected', 'Disconnected'].includes(props.item.state)
);
</script>

<template>
	<div>
		<div class="relative w-[62px] h-[62px]">
			<svg
				v-if="item.ack_bytes" width="62" height="62" viewBox="0 0 250 250"
				class="circular-progress" :style="transfers.getProgress(item)"
				:class="{ error: isErrorState }">
				<circle class="bg" />
				<circle class="fg" />
			</svg>
			<div
				class="h-14 w-14 rounded-full bg-surface-0 dark:bg-surface-900
				       border border-surface-200 dark:border-surface-800
				       absolute top-0 left-0 bottom-0 right-0 m-auto
				       text-zinc-700 dark:text-zinc-200
				       flex items-center justify-center">
				<Icon :name="icon" :size="22" />
			</div>
		</div>

		<p
			v-if="(item.state === 'WaitingForUserConsent' || item.state === 'SentIntroduction') && item.pin_code"
			class="text-center inline-flex gap-1 mt-4 text-sm items-center text-zinc-700 dark:text-zinc-300">
			<Icon name="shield-pin" :size="16" />
			{{ item.pin_code }}
		</p>
	</div>
</template>
