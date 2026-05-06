<script setup lang="ts">
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { AppButton, IconButton, ToastType, useAppStore, useThemeStore, useToastStore } from '../vue_lib';
import VisibilityMenu from './VisibilityMenu.vue';

const RELEASES_URL = 'https://github.com/Slush97/ferryshare/releases/latest';

const app = useAppStore();
const theme = useThemeStore();
const toasts = useToastStore();

const props = defineProps<{ openUrl: (url: string) => void }>();

function toggleTheme() {
	theme.setMode(theme.isDark ? 'light' : 'dark');
}

async function handleUpdate() {
	try {
		const update = await check();
		if (!update) {
			// Plugin says we're current; if our GitHub-API check disagreed,
			// open the releases page so the user can grab it manually.
			props.openUrl(RELEASES_URL);
			return;
		}
		toasts.addToast(`Downloading v${update.version}…`, ToastType.Info);
		await update.downloadAndInstall();
		await relaunch();
	} catch (e) {
		console.error('updater failed, falling back to releases page', e);
		toasts.addToast('Could not auto-update — opening releases page', ToastType.Error);
		props.openUrl(RELEASES_URL);
	}
}
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
				@click="handleUpdate">
				<span class="text-accent-700 dark:text-accent-300">Update</span>
				<span class="text-xs hidden sm:inline">v{{ app.version }} → v{{ app.newVersion }}</span>
			</AppButton>
			<span v-else class="text-xs text-ink-500 dark:text-ink-300 hidden sm:inline font-mono">
				v{{ app.version }}
			</span>

			<IconButton
				:icon="theme.isDark ? 'sun' : 'moon'"
				size="sm"
				:label="theme.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
				@click="toggleTheme" />
			<IconButton icon="settings" size="sm" label="Settings" @click="app.settingsOpen = true" />
		</div>
	</div>
</template>
