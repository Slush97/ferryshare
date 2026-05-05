<script setup lang="ts">
import { AppButton, IconButton, useAppStore } from '../vue_lib';
import VisibilityMenu from './VisibilityMenu.vue';

const app = useAppStore();

defineProps<{ openUrl: (url: string) => void }>();
</script>

<template>
	<div
		class="flex flex-row justify-between items-center gap-3 px-4 py-2 sm:px-6 sm:py-4
		       border-b border-surface-200 dark:border-surface-800">
		<div class="min-w-0 flex-1">
			<h4 class="text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300 font-medium">
				Device
			</h4>
			<h2 class="font-serif text-lg sm:text-2xl text-ink-800 dark:text-ink-100 truncate">
				{{ app.hostname }}
			</h2>
		</div>

		<div class="flex justify-end items-center gap-2 shrink min-w-0">
			<VisibilityMenu />

			<AppButton
				v-if="app.newVersion"
				size="sm"
				@click="openUrl('https://github.com/Slush97/ferryshare/releases/latest')">
				<span class="text-accent-700 dark:text-accent-300">Update</span>
				<span class="text-xs hidden sm:inline">v{{ app.version }} → v{{ app.newVersion }}</span>
			</AppButton>
			<span v-else class="text-xs text-ink-500 dark:text-ink-300 hidden sm:inline font-mono">
				v{{ app.version }}
			</span>

			<IconButton icon="settings" size="sm" label="Settings" @click="app.settingsOpen = true" />
		</div>
	</div>
</template>
