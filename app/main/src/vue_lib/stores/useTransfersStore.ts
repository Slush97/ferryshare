import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { ChannelMessage } from '@martichou/core_lib/bindings/ChannelMessage';
import { EndpointInfo } from '@martichou/core_lib/bindings/EndpointInfo';
import { OutboundPayload } from '@martichou/core_lib/bindings/OutboundPayload';
import { SendInfo } from '@martichou/core_lib/bindings/SendInfo';
import { ChannelAction } from '@martichou/core_lib';

import { DisplayedItem, ToDelete, stateToDisplay } from '../types';

export const useTransfersStore = defineStore('transfers', () => {
	const requests = ref<ChannelMessage[]>([]);
	const endpointsInfo = ref<EndpointInfo[]>([]);
	const toDelete = ref<ToDelete[]>([]);
	const outboundPayload = ref<OutboundPayload | undefined>();
	const discoveryRunning = ref(false);
	const isDragHovering = ref(false);

	const displayedItems = computed<DisplayedItem[]>(() => {
		const out: DisplayedItem[] = [];

		endpointsInfo.value.forEach((el) => {
			if (out.find((nel) => nel.id === el.id)) return;
			out.push({
				id: el.id,
				name: el.name ?? 'Unknown',
				deviceType: el.rtype ?? 'Unknown',
				endpoint: true,
			});
		});

		requests.value
			.filter((el) => stateToDisplay.includes(el.state ?? 'Initial'))
			.forEach((el) => {
				const idx = out.findIndex((nel) => nel.id === el.id);
				const elem: DisplayedItem = {
					id: el.id,
					name: el.meta?.source?.name ?? 'Unknown',
					deviceType: el.meta?.source?.device_type ?? 'Unknown',
					endpoint: false,
					state: el.state ?? undefined,
					pin_code: el.meta?.pin_code ?? undefined,
					destination: el.meta?.destination ?? undefined,
					files: el.meta?.files ?? undefined,
					text_description: el.meta?.text_description ?? undefined,
					text_payload: el.meta?.text_payload ?? undefined,
					text_type: el.meta?.text_type ?? undefined,
					ack_bytes: (el.meta?.ack_bytes as number | undefined) ?? undefined,
					total_bytes: (el.meta?.total_bytes as number | undefined) ?? undefined,
				};
				if (idx !== -1) out.splice(idx, 1, elem);
				else out.push(elem);
			});

		return out;
	});

	const isEmpty = computed(() => displayedItems.value.length === 0);

	function upsertRequest(cm: ChannelMessage) {
		const idx = requests.value.findIndex((el) => el.id === cm.id);
		if (cm.state === 'Disconnected') {
			toDelete.value.push({ id: cm.id, triggered: Date.now() });
		}
		if (idx !== -1) {
			const prev = requests.value[idx];
			requests.value.splice(idx, 1, {
				...cm,
				state: cm.state ?? prev.state,
				meta: cm.meta ?? prev.meta,
			});
		} else {
			requests.value.push(cm);
		}
	}

	function upsertEndpoint(ei: EndpointInfo) {
		const idx = endpointsInfo.value.findIndex((el) => el.id === ei.id);
		if (!ei.present) {
			if (idx !== -1) endpointsInfo.value.splice(idx, 1);
			return;
		}
		if (idx !== -1) endpointsInfo.value.splice(idx, 1, ei);
		else endpointsInfo.value.push(ei);
	}

	function removeRequest(id: string) {
		const idx = requests.value.findIndex((el) => el.id === id);
		if (idx !== -1) requests.value.splice(idx, 1);
	}

	async function sendInfo(eid: string) {
		if (!outboundPayload.value) return;
		const ei = endpointsInfo.value.find((el) => el.id === eid);
		if (!ei || !ei.ip || !ei.port) return;
		const msg: SendInfo = {
			id: ei.id,
			name: ei.name ?? 'Unknown',
			addr: `${ei.ip}:${ei.port}`,
			ob: outboundPayload.value,
		};
		await invoke('send_payload', { message: msg });
	}

	async function sendCmd(id: string, action: ChannelAction) {
		const cm: ChannelMessage = {
			id, direction: 'FrontToLib', action, meta: null, state: null, rtype: null,
		};
		await invoke('send_to_rs', { message: cm });
	}

	async function clearSending() {
		await invoke('stop_discovery');
		outboundPayload.value = undefined;
		discoveryRunning.value = false;
		endpointsInfo.value = [];
	}

	async function ensureDiscovery() {
		if (discoveryRunning.value) return;
		await invoke('start_discovery');
		discoveryRunning.value = true;
	}

	function setOutbound(files: string[]) {
		outboundPayload.value = { Files: files } as OutboundPayload;
	}

	function getProgress(item: DisplayedItem): string {
		if (!item.ack_bytes || !item.total_bytes) return '--progress: 0';
		return `--progress: ${(item.ack_bytes / item.total_bytes) * 100}`;
	}

	return {
		requests, endpointsInfo, toDelete, outboundPayload,
		discoveryRunning, isDragHovering,
		displayedItems, isEmpty,
		upsertRequest, upsertEndpoint, removeRequest,
		sendInfo, sendCmd, clearSending, ensureDiscovery, setOutbound, getProgress,
	};
});
