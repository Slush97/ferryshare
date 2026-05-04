<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';
import { IconName } from '../../icons/registry';

const props = withDefaults(
	defineProps<{
		icon: IconName;
		size?: 'sm' | 'md';
		label: string;
		variant?: 'ghost' | 'danger';
		disabled?: boolean;
	}>(),
	{ size: 'md', variant: 'ghost', disabled: false }
);

const SIZES = { sm: 'h-8 w-8', md: 'h-10 w-10' };
const ICON_SIZES = { sm: 18, md: 22 };
const VARIANTS = {
	ghost: 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-500/10 dark:hover:bg-zinc-300/10',
	danger: 'text-red-600 dark:text-red-400 hover:bg-red-500/10',
};

const cls = computed(
	() =>
		'inline-flex items-center justify-center rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ' +
		SIZES[props.size] +
		' ' +
		VARIANTS[props.variant]
);
</script>

<template>
	<button type="button" :class="cls" :aria-label="label" :disabled="disabled">
		<Icon :name="icon" :size="ICON_SIZES[size]" />
	</button>
</template>
