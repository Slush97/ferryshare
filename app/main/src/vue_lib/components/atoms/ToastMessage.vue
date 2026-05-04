<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { ToastType } from '../../types';

const props = defineProps({
	id: { type: Number, required: true },
	type: { type: String as PropType<ToastType>, default: ToastType.Success },
	message: { type: String, required: true },
});

const TONES: Record<ToastType, string> = {
	[ToastType.Success]:
		'bg-accent-50 dark:bg-accent-500/15 text-accent-900 dark:text-accent-200 border-accent-200 dark:border-accent-500/30',
	[ToastType.Error]:
		'bg-red-50 dark:bg-red-500/15 text-red-900 dark:text-red-200 border-red-200 dark:border-red-500/30',
	[ToastType.Info]:
		'bg-surface-100 dark:bg-surface-800 text-ink-800 dark:text-ink-100 border-surface-200 dark:border-surface-700',
};

const cls = computed(() => TONES[props.type]);
</script>

<template>
	<div
		class="w-full p-3 rounded-md shadow-md border text-sm"
		:class="cls">
		{{ message }}
	</div>
</template>
