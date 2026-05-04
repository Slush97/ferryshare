<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import {
	AppButton, SettingRow, ThemeMode, useAppStore, useThemeStore,
} from '../vue_lib';

const app = useAppStore();
const theme = useThemeStore();

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

async function pickDownloadFolder() {
	const el = await openDialog({
		title: 'Select the destination for files',
		directory: true,
		multiple: false,
	});
	if (!el) return;
	await app.setDownloadPath(el as string);
}

function close() {
	app.settingsOpen = false;
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape' && app.settingsOpen) close();
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
	<Transition name="fx-modal">
		<div
			v-if="app.settingsOpen"
			class="absolute inset-0 z-20 flex justify-center items-center p-4
			       bg-ink-900/40 backdrop-blur-sm"
			@click.self="close">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="settings-title"
				class="fx-modal-card paper-card border border-surface-200/60 dark:border-surface-700
				       rounded-md p-4 w-full max-w-sm max-h-full overflow-y-auto
				       text-ink-800 dark:text-ink-100 shadow-2xl">
				<div class="flex flex-row justify-between items-center">
					<h3 id="settings-title" class="font-serif text-xl">
						Settings
					</h3>
					<AppButton size="sm" @click="close">
						Close
					</AppButton>
				</div>

				<div class="py-4 flex flex-col gap-1">
					<div class="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300 font-medium">
						Appearance
					</div>
					<div class="rounded-md p-3 flex flex-row justify-between items-center">
						<span>Theme</span>
						<div
							class="inline-flex rounded-md border border-surface-200 dark:border-surface-700
								       overflow-hidden text-sm">
							<button
								v-for="m in THEME_MODES" :key="m"
								type="button"
								class="px-3 py-1.5 transition-colors duration-150 capitalize"
								:class="theme.mode === m
									? 'bg-accent-600 text-ink-50'
									: 'bg-transparent text-ink-700 dark:text-ink-100 hover:bg-accent-700/10 dark:hover:bg-accent-300/10'"
								@click="theme.setMode(m)">
								{{ m }}
							</button>
						</div>
					</div>

					<div class="px-3 pt-3 pb-1 text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300 font-medium">
						Behavior
					</div>
					<SettingRow label="Start on boot" :checked="app.autostart" @toggle="app.setAutostart(!app.autostart)" />
					<SettingRow label="Keep running on close" :checked="!app.realclose" @toggle="app.setRealclose(!app.realclose)" />
					<SettingRow label="Start minimized" :checked="app.startminimized" @toggle="app.setStartminimized(!app.startminimized)" />

					<button
						type="button"
						class="cursor-pointer flex flex-col items-start w-full text-left p-3 rounded-md
							       hover:bg-accent-700/10 dark:hover:bg-accent-300/10 transition-colors"
						@click="pickDownloadFolder">
						<span>Change download folder</span>
						<span
							class="overflow-hidden whitespace-nowrap text-ellipsis text-xs max-w-80
								       text-ink-500 dark:text-ink-300 font-mono">
							&gt; {{ app.downloadPath ?? 'Default downloads folder' }}
						</span>
					</button>
				</div>
			</div>
		</div>
	</Transition>
</template>
