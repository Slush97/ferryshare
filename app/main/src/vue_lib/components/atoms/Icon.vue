<script setup lang="ts">
import { computed } from 'vue';
import { ICONS, IconName } from '../../icons/registry';

const props = withDefaults(
	defineProps<{
		name: IconName;
		size?: string | number;
	}>(),
	{ size: '1em' }
);

const icon = computed(() => ICONS[props.name]);
const sizeStr = computed(() =>
	typeof props.size === 'number' ? `${props.size}px` : props.size
);
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:viewBox="icon.viewBox"
		:width="sizeStr"
		:height="sizeStr"
		fill="currentColor"
		aria-hidden="true">
		<path :d="icon.d" />
	</svg>
</template>
