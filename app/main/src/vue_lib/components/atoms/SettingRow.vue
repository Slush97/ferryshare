<script setup lang="ts">
defineProps<{ label: string; checked: boolean }>();
defineEmits<{ (e: 'toggle'): void }>();
</script>

<template>
	<label
		class="cursor-pointer flex flex-row justify-between items-center p-3 rounded-xl
		       hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
		@click.prevent="$emit('toggle')">
		<span>{{ label }}</span>
		<input type="checkbox" :checked="checked" class="checkbox focus:outline-none">
	</label>
</template>
