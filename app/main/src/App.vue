<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import HomePage from './components/HomePage.vue';
import TitleBar from './components/TitleBar.vue';
import { useThemeStore } from './vue_lib';

const showCustomTitleBar = ref(false);
const themeReady = ref(false);

onMounted(async () => {
	try {
		showCustomTitleBar.value = await invoke<boolean>('get_use_custom_titlebar');
	} catch {
		showCustomTitleBar.value = false;
	}
	await useThemeStore().hydrate();
	themeReady.value = true;
});
</script>

<template>
	<div
		class="w-screen h-screen flex flex-col select-none cursor-default
	            bg-surface-0 dark:bg-surface-950 text-zinc-900 dark:text-zinc-100">
		<TitleBar v-if="showCustomTitleBar" />
		<div class="flex-1 min-h-0">
			<Suspense v-if="themeReady">
				<HomePage />
			</Suspense>
		</div>
	</div>
</template>
