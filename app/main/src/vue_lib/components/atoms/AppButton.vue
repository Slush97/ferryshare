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
	primary: 'bg-accent-500 text-white hover:bg-accent-600',
	ghost: 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-500/10 dark:hover:bg-zinc-300/10',
	danger: 'text-red-600 dark:text-red-400 hover:bg-red-500/10',
};

const cls = computed(
	() =>
		'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ' +
		SIZES[props.size] +
		' ' +
		VARIANTS[props.variant]
);
</script>

<template>
	<button :type="type" :class="cls" :disabled="disabled">
		<slot />
	</button>
</template>
