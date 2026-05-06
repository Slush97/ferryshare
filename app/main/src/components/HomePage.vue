<script setup lang="ts">
import { onMounted, onBeforeUnmount, provide } from 'vue';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

import { ChannelMessage } from 'ferry_lib/bindings/ChannelMessage';
import { EndpointInfo } from 'ferry_lib/bindings/EndpointInfo';

import { ToastNotification, ToastType, useAppStore, useToastStore, useTransfersStore } from '../vue_lib';

import SettingsModal from './SettingsModal.vue';
import FileViewer from './FileViewer.vue';
import Heading from './Heading.vue';
import OutboundPanel from './OutboundPanel.vue';
import ContentStatus from './ContentStatus.vue';
import DeviceList from './DeviceList.vue';

const app = useAppStore();
const transfers = useTransfersStore();
const toasts = useToastStore();

const unlisteners: UnlistenFn[] = [];

async function openUrl(target: string) {
	try {
		await invoke('open_path', { path: target });
	} catch (e) {
		toasts.addToast("Couldn't open that — it may have been moved or deleted", ToastType.Error);
		console.error(e);
	}
}

async function copyText(text: string) {
	try {
		await writeText(text);
		toasts.addToast('Copied to clipboard', ToastType.Success);
	} catch (e) {
		toasts.addToast('Unknown error while copying text', ToastType.Error);
		console.error(e);
	}
}

provide('openUrl', openUrl);
provide('copyText', copyText);

onMounted(async () => {
	await app.hydrate();

	if (!(await isPermissionGranted())) {
		await requestPermission();
	}

	unlisteners.push(
		await listen<ChannelMessage>('rs2js_channelmessage', (e) => transfers.upsertRequest(e.payload))
	);
	unlisteners.push(
		await listen<EndpointInfo>('rs2js_endpointinfo', (e) => transfers.upsertEndpoint(e.payload))
	);
	unlisteners.push(
		await listen('visibility_updated', () => app.refreshVisibility())
	);
	unlisteners.push(
		await getCurrentWindow().onDragDropEvent(async (event) => {
			if (event.payload.type === 'over') {
				transfers.isDragHovering = true;
			} else if (event.payload.type === 'drop') {
				transfers.isDragHovering = false;
				transfers.setOutbound(event.payload.paths);
				await transfers.ensureDiscovery();
			} else {
				transfers.isDragHovering = false;
			}
		})
	);
});

onBeforeUnmount(() => {
	unlisteners.forEach((u) => u());
});
</script>

<template>
	<div
		class="flex flex-col w-full h-full bg-paper text-ink-800 dark:text-ink-100
	            max-w-full max-h-full overflow-hidden">
		<ToastNotification />
		<SettingsModal />
		<FileViewer />

		<Heading :open-url="openUrl" />

		<div class="doodle-overlay flex-1 min-h-0 overflow-y-auto">
			<div class="min-h-full flex flex-col p-3 sm:p-4 md:p-8">
				<OutboundPanel />
				<ContentStatus />
				<DeviceList />
			</div>

			<!-- Drag-frame: appears only while files are being dragged over the window -->
			<div
				v-if="transfers.isDragHovering"
				class="drag-frame absolute inset-3 z-10" />
		</div>
	</div>
</template>
