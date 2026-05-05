<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { ToastType } from '../../types';

const props = defineProps({
	id: { type: Number, required: true },
	type: { type: String as PropType<ToastType>, default: ToastType.Success },
	message: { type: String, required: true },
});

const TONES: Record<ToastType, string> = {
	[ToastType.Success]: 'border-l-accent-500',
	[ToastType.Error]:   'border-l-red-600',
	[ToastType.Info]:    'border-l-ink-400 dark:border-l-ink-300',
};

const cls = computed(() => TONES[props.type]);
</script>

<template>
	<div
		class="w-full p-3 rounded-md shadow-md text-sm
		       bg-surface-0 dark:bg-surface-800
		       text-ink-800 dark:text-ink-100
		       border border-surface-200 dark:border-surface-700
		       border-l-4"
		:class="cls">
		{{ message }}
	</div>
</template>
