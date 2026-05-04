<script setup lang="ts">
import { computed, inject } from 'vue';
import { convertFileSrc } from '@tauri-apps/api/core';
import {
	AppButton, DisplayedItem, fileKind, isPreviewable, joinPath,
	useTransfersStore, useViewerStore,
} from '../vue_lib';
import ItemSide from './ItemSide.vue';

const transfers = useTransfersStore();
const viewer = useViewerStore();

const props = defineProps<{ item: DisplayedItem }>();

const openUrl = inject<(u: string) => void>('openUrl', () => undefined);
const copyText = inject<(t: string) => void>('copyText', () => undefined);

const isInProgress = computed(() =>
	['SentIntroduction', 'SendingFiles', 'ReceivingFiles'].includes(props.item.state ?? 'Initial')
);

const isSending = computed(() =>
	['SentIntroduction', 'SendingFiles'].includes(props.item.state ?? '')
);

const terminalState = computed(() => {
	const s = props.item.state ?? '';
	if (s === 'Cancelled') return 'Transfer cancelled';
	if (s === 'Rejected') return 'Transfer rejected';
	if (s === 'Disconnected') return 'Unexpected disconnection';
	return null;
});

const filePaths = computed<string[]>(() => {
	if (!props.item.destination || !props.item.files) return [];
	return props.item.files.map((f) => joinPath(props.item.destination!, f));
});

const previewableFiles = computed(() => filePaths.value.filter(isPreviewable));
const firstPreviewable = computed(() => previewableFiles.value[0] ?? null);

const imageThumbs = computed(() =>
	filePaths.value.filter((p) => fileKind(p) === 'image').slice(0, 4)
);

function onCardClick() {
	if (props.item.endpoint) transfers.sendInfo(props.item.id);
}

function viewFile(path: string) {
	viewer.open(path);
}
</script>

<template>
	<div
		class="paper-card w-full rounded-md flex flex-row gap-6 p-4 mb-3
		       transition-colors
		       hover:border-accent-700/40 dark:hover:border-accent-300/40
		       focus-visible:ring-2 focus-visible:ring-accent-500 outline-none"
		:class="{ 'cursor-pointer': item.endpoint }"
		:role="item.endpoint ? 'button' : undefined"
		:tabindex="item.endpoint ? 0 : undefined"
		@click="onCardClick"
		@keydown.enter.space.prevent="onCardClick">
		<ItemSide :item="item" />

		<div class="flex-1 flex flex-col text-sm min-w-0" :class="{ 'justify-center': !item.state }">
			<h4 class="font-serif text-base text-ink-800 dark:text-ink-100">
				{{ item.name }}
			</h4>

			<div v-if="item.state === 'WaitingForUserConsent'" class="flex-1 flex flex-col justify-between">
				<p class="mt-3">
					Wants to share {{ item.files?.join(', ') ?? item.text_description ?? 'some file(s).' }}
				</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton size="sm" variant="primary" @click.stop="transfers.sendCmd(item.id, 'AcceptTransfer')">
						Accept
					</AppButton>
					<AppButton size="sm" @click.stop="transfers.sendCmd(item.id, 'RejectTransfer')">
						Decline
					</AppButton>
				</div>
			</div>

			<div v-else-if="isInProgress">
				<p class="mt-2 italic">
					{{ isSending ? 'Sending…' : 'Receiving…' }}
				</p>
				<p
					v-for="f in item.files ?? []" :key="f"
					class="overflow-hidden whitespace-nowrap text-ellipsis font-mono text-xs">
					{{ f }}
				</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton size="sm" @click.stop="transfers.sendCmd(item.id, 'CancelTransfer')">
						Cancel
					</AppButton>
				</div>
			</div>

			<div v-else-if="item.state === 'Finished'">
				<p class="mt-2">
					Received <span v-if="item.text_type">text</span>
				</p>

				<!-- File list -->
				<div v-if="filePaths.length > 0" class="mt-1 space-y-1">
					<button
						v-for="(p, i) in filePaths" :key="p"
						type="button"
						:disabled="!isPreviewable(p)"
						class="block w-full text-left overflow-hidden whitespace-nowrap text-ellipsis
						       font-mono text-xs rounded px-1 -mx-1 transition-colors
						       enabled:hover:bg-accent-700/10 enabled:dark:hover:bg-accent-300/10
						       enabled:hover:text-accent-700 enabled:dark:hover:text-accent-300
						       enabled:cursor-pointer disabled:cursor-default"
						@click.stop="isPreviewable(p) && viewFile(p)">
						{{ item.files![i] }}
					</button>
				</div>

				<!-- Image thumbnail strip -->
				<div v-if="imageThumbs.length > 0" class="mt-2 flex flex-row gap-2">
					<button
						v-for="thumb in imageThumbs" :key="thumb"
						type="button"
						class="w-16 h-16 rounded-md overflow-hidden border border-surface-200 dark:border-surface-700
						       hover:border-accent-700 dark:hover:border-accent-300 transition-colors"
						@click.stop="viewFile(thumb)">
						<img :src="convertFileSrc(thumb)" :alt="thumb" class="w-full h-full object-cover">
					</button>
				</div>

				<p
					v-if="item.destination && item.files"
					class="mt-2 overflow-hidden whitespace-nowrap text-ellipsis text-xs italic text-ink-500 dark:text-ink-300">
					Saved to {{ item.destination }}
				</p>
				<p
					v-if="item.text_type"
					class="mt-1 !select-text cursor-text overflow-hidden whitespace-nowrap text-ellipsis font-mono text-xs">
					{{ item.text_payload }}
				</p>

				<div class="flex flex-row justify-end gap-2 mt-2">
					<AppButton
						v-if="firstPreviewable"
						size="sm" variant="primary"
						@click.stop="viewFile(firstPreviewable)">
						View
					</AppButton>
					<AppButton
						v-if="item.destination || (item.text_type === 'Url' && item.text_payload)"
						size="sm"
						@click.stop="openUrl(item.destination ?? item.text_payload!)">
						Open
					</AppButton>
					<AppButton
						v-if="item.text_type && item.text_payload"
						size="sm"
						@click.stop="copyText(item.text_payload)">
						Copy
					</AppButton>
					<AppButton size="sm" @click.stop="transfers.removeRequest(item.id)">
						Clear
					</AppButton>
				</div>
			</div>

			<div v-else-if="terminalState">
				<p class="mt-2 italic text-ink-500 dark:text-ink-300">
					{{ terminalState }}
				</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton size="sm" @click.stop="transfers.removeRequest(item.id)">
						Clear
					</AppButton>
				</div>
			</div>
		</div>
	</div>
</template>
