<script setup lang="ts">
import { computed, inject } from 'vue';
import { AppButton, DisplayedItem, useTransfersStore } from '../vue_lib';
import ItemSide from './ItemSide.vue';

const transfers = useTransfersStore();

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

function onCardClick() {
	if (props.item.endpoint) transfers.sendInfo(props.item.id);
}
</script>

<template>
	<div
		class="paper-card w-full rounded-md flex flex-row gap-6 p-4 mb-3
		       border border-surface-200/60 dark:border-surface-700
		       transition-colors
		       hover:border-accent-700/40 dark:hover:border-accent-300/40"
		:class="{ 'cursor-pointer': item.endpoint }"
		@click="onCardClick">
		<ItemSide :item="item" />

		<div class="flex-1 flex flex-col text-sm min-w-0" :class="{ 'justify-center': !item.state }">
			<h4 class="font-serif text-base text-ink-800 dark:text-ink-100">{{ item.name }}</h4>

			<div v-if="item.state === 'WaitingForUserConsent'" class="flex-1 flex flex-col justify-between">
				<p class="mt-3">
					Wants to share {{ item.files?.join(', ') ?? item.text_description ?? 'some file(s).' }}
				</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton size="sm" variant="primary" @click.stop="transfers.sendCmd(item.id, 'AcceptTransfer')">Accept</AppButton>
					<AppButton size="sm" @click.stop="transfers.sendCmd(item.id, 'RejectTransfer')">Decline</AppButton>
				</div>
			</div>

			<div v-else-if="isInProgress">
				<p class="mt-2 italic">{{ isSending ? 'Sending…' : 'Receiving…' }}</p>
				<p v-for="f in item.files ?? []" :key="f" class="overflow-hidden whitespace-nowrap text-ellipsis font-mono text-xs">{{ f }}</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton size="sm" @click.stop="transfers.sendCmd(item.id, 'CancelTransfer')">Cancel</AppButton>
				</div>
			</div>

			<div v-else-if="item.state === 'Finished'">
				<p class="mt-2">Received <span v-if="item.text_type">text</span></p>
				<p v-for="f in item.files ?? []" :key="f" class="overflow-hidden whitespace-nowrap text-ellipsis font-mono text-xs">{{ f }}</p>
				<p v-if="item.files" class="mt-2 overflow-hidden whitespace-nowrap text-ellipsis text-xs italic text-ink-500 dark:text-ink-300">
					Saved to {{ item.destination }}
				</p>
				<p v-if="item.text_type" class="!select-text cursor-text overflow-hidden whitespace-nowrap text-ellipsis font-mono text-xs">
					{{ item.text_payload }}
				</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton v-if="item.destination || (item.text_type === 'Url' && item.text_payload)" size="sm" @click.stop="openUrl(item.destination ?? item.text_payload!)">Open</AppButton>
					<AppButton v-if="item.text_type && item.text_payload" size="sm" @click.stop="copyText(item.text_payload)">Copy</AppButton>
					<AppButton size="sm" @click.stop="transfers.removeRequest(item.id)">Clear</AppButton>
				</div>
			</div>

			<div v-else-if="terminalState">
				<p class="mt-2 italic text-ink-500 dark:text-ink-300">{{ terminalState }}</p>
				<div class="flex flex-row justify-end gap-2 mt-1">
					<AppButton size="sm" @click.stop="transfers.removeRequest(item.id)">Clear</AppButton>
				</div>
			</div>
		</div>
	</div>
</template>
