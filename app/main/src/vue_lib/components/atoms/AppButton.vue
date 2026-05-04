<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const props = withDefaults(
	defineProps<{
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit';
		disabled?: boolean;
	}>(),
	{ variant: 'ghost', size: 'md', type: 'button', disabled: false }
);

const SIZES: Record<Size, string> = {
	sm: 'h-8 px-3 text-sm',
	md: 'h-10 px-4 text-sm',
	lg: 'h-12 px-5 text-base',
};

const VARIANTS: Record<Variant, string> = {
	primary: 'bg-accent-600 text-ink-50 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600',
	ghost:   'text-ink-700 dark:text-ink-100 hover:bg-accent-700/10 dark:hover:bg-accent-300/10',
	danger:  'text-red-700 dark:text-red-400 hover:bg-red-700/10',
};

const cls = computed(
	() =>
		'inline-flex items-center justify-center gap-2 rounded-md font-medium '
		+ 'transition-[background-color,color,transform] duration-150 ease-out '
		+ 'active:scale-[0.97] '
		+ 'focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 '
		+ 'focus-visible:ring-offset-transparent outline-none '
		+ 'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 '
		+ SIZES[props.size] + ' '
		+ VARIANTS[props.variant]
);
</script>

<template>
	<button :type="type" :class="cls" :disabled="disabled">
		<slot />
	</button>
</template>
