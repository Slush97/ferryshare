import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { enable, disable } from '@tauri-apps/plugin-autostart';
import { gt } from 'semver';
import { Visibility } from 'ferry_lib/bindings/Visibility';

import { settingsStore } from '../storage';
import {
	autostartKey, downloadPathKey, numberToVisibility, realcloseKey,
	startminimizedKey, visibilityKey, visibilityToNumber,
} from '../types';

const RELEASE_API = 'https://api.github.com/repos/Slush97/ferryshare/releases/latest';

// core_lib: TICK_INTERVAL = 60s — duration of "Temporarily" visibility before falling back to Invisible.
export const TEMPORARY_VISIBILITY_SECONDS = 60;

export const useAppStore = defineStore('app', () => {
	const version = ref<string | null>(null);
	const newVersion = ref<string | null>(null);
	const hostname = ref<string>('');
	const autostart = ref(true);
	const realclose = ref(false);
	const startminimized = ref(false);
	const visibility = ref<Visibility>('Visible');
	const downloadPath = ref<string | undefined>();
	const settingsOpen = ref(false);

	const temporaryUntil = ref<number | null>(null);
	const now = ref(Date.now());
	let tickHandle: ReturnType<typeof setInterval> | null = null;

	const temporarySecondsLeft = computed(() => {
		if (!temporaryUntil.value) return 0;
		const ms = temporaryUntil.value - now.value;
		return ms > 0 ? Math.ceil(ms / 1000) : 0;
	});

	function startTick() {
		if (tickHandle) return;
		tickHandle = setInterval(() => {
			now.value = Date.now();
			if (temporaryUntil.value && now.value >= temporaryUntil.value) {
				stopTick();
				temporaryUntil.value = null;
			}
		}, 500);
	}
	function stopTick() {
		if (!tickHandle) return;
		clearInterval(tickHandle);
		tickHandle = null;
	}

	watch(visibility, (v) => {
		if (v === 'Temporarily') {
			temporaryUntil.value = Date.now() + TEMPORARY_VISIBILITY_SECONDS * 1000;
			now.value = Date.now();
			startTick();
		} else {
			temporaryUntil.value = null;
			stopTick();
		}
	});

	async function hydrate() {
		const store = await settingsStore();

		hostname.value = await invoke<string>('get_hostname');
		version.value = await getVersion();

		visibility.value = numberToVisibility[(await store.get<number>(visibilityKey)) ?? 0];
		realclose.value = (await store.get<boolean>(realcloseKey)) ?? false;
		startminimized.value = (await store.get<boolean>(startminimizedKey)) ?? false;
		downloadPath.value = (await store.get<string>(downloadPathKey)) ?? undefined;

		if (!(await store.has(autostartKey))) {
			await setAutostart(true);
		} else {
			autostart.value = (await store.get<boolean>(autostartKey)) ?? false;
			if (autostart.value) await enable(); else await disable();
		}

		void checkLatestVersion();
	}

	async function setAutostart(v: boolean) {
		if (v) await enable(); else await disable();
		const store = await settingsStore();
		await store.set(autostartKey, v);
		await store.save();
		autostart.value = v;
	}

	async function setRealclose(v: boolean) {
		const store = await settingsStore();
		await store.set(realcloseKey, v);
		await store.save();
		realclose.value = v;
	}

	async function setStartminimized(v: boolean) {
		const store = await settingsStore();
		await store.set(startminimizedKey, v);
		await store.save();
		startminimized.value = v;
	}

	async function setVisibility(v: Visibility) {
		await invoke('change_visibility', { message: v });
		const store = await settingsStore();
		await store.set(visibilityKey, visibilityToNumber[v]);
		await store.save();
		visibility.value = v;
	}

	async function refreshVisibility() {
		const store = await settingsStore();
		visibility.value = numberToVisibility[(await store.get<number>(visibilityKey)) ?? 0];
	}

	async function toggleVisibility() {
		if (visibility.value === 'Temporarily') return;
		await setVisibility(visibility.value === 'Visible' ? 'Invisible' : 'Visible');
	}

	async function setDownloadPath(p: string) {
		await invoke('change_download_path', { message: p });
		const store = await settingsStore();
		await store.set(downloadPathKey, p);
		await store.save();
		downloadPath.value = p;
	}

	async function checkLatestVersion() {
		try {
			const r = await fetch(RELEASE_API);
			if (!r.ok) return;
			const data = await r.json();
			const tag = (data.tag_name as string).substring(1);
			if (version.value && gt(tag, version.value)) newVersion.value = tag;
		} catch (e) {
			console.error('checkLatestVersion', e);
		}
	}

	return {
		version, newVersion, hostname, autostart, realclose, startminimized,
		visibility, downloadPath, settingsOpen,
		temporaryUntil, temporarySecondsLeft,
		hydrate, setAutostart, setRealclose, setStartminimized,
		setVisibility, refreshVisibility, toggleVisibility, setDownloadPath,
	};
});
