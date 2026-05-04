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
	ghost:  'text-ink-700 dark:text-ink-100 hover:bg-accent-700/10 dark:hover:bg-accent-300/10',
	danger: 'text-red-700 dark:text-red-400 hover:bg-red-700/10',
};

const cls = computed(
	() =>
		'inline-flex items-center justify-center rounded-md '
		+ 'transition-[background-color,color,transform] duration-150 ease-out '
		+ 'active:scale-[0.94] '
		+ 'focus-visible:ring-2 focus-visible:ring-accent-500 outline-none '
		+ 'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 '
		+ SIZES[props.size] + ' ' + VARIANTS[props.variant]
);
</script>

<template>
	<button type="button" :class="cls" :aria-label="label" :disabled="disabled">
		<Icon :name="icon" :size="ICON_SIZES[size]" />
	</button>
</template>
