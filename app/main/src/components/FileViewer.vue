<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import {
	AppButton, FileKind, fileKind, getExtension,
	useToastStore, useViewerStore, ToastType,
} from '../vue_lib';

const viewer = useViewerStore();
const toasts = useToastStore();

const filename = computed(() => viewer.path?.split(/[\\/]/).pop() ?? '');
const kind = computed<FileKind>(() => (viewer.path ? fileKind(viewer.path) : 'unknown'));
const ext = computed(() => (viewer.path ? getExtension(viewer.path) : ''));
const assetUrl = computed(() => (viewer.path ? convertFileSrc(viewer.path) : ''));

const textContent = ref<string | null>(null);
const textError = ref<string | null>(null);
const loadingText = ref(false);

watch([() => viewer.path, kind], async ([p, k]) => {
	textContent.value = null;
	textError.value = null;
	if (!p || k !== 'text') return;
	loadingText.value = true;
	try {
		textContent.value = await invoke<string>('read_text_file', { path: p });
	} catch (e) {
		textError.value = String(e);
	} finally {
		loadingText.value = false;
	}
}, { immediate: true });

async function openExternal() {
	if (!viewer.path) return;
	try {
		await invoke('open_path', { path: viewer.path });
	} catch (e) {
		toasts.addToast('Could not open externally', ToastType.Error);
		console.error(e);
	}
}

function onKey(e: KeyboardEvent) {
	if (e.key === 'Escape' && viewer.isOpen) viewer.close();
}

onMounted(() => document.addEventListener('keydown', onKey));
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
</script>

<template>
	<Transition name="fx-modal">
		<div
			v-if="viewer.isOpen"
			class="absolute inset-0 z-30 flex items-center justify-center
			       bg-ink-900/55 backdrop-blur-sm p-4"
			@click.self="viewer.close()">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="viewer-title"
				class="fx-modal-card paper-card w-full max-w-5xl h-[90%] rounded-md flex flex-col overflow-hidden shadow-2xl">
				<!-- Header -->
				<div
					class="flex items-center gap-3 px-4 py-3
			            border-b border-surface-200/60 dark:border-surface-700">
					<div
						class="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5
				            rounded border border-accent-700/30 dark:border-accent-300/30
				            text-accent-700 dark:text-accent-300 bg-accent-500/5">
						{{ kind === 'unknown' ? (ext || 'file') : kind }}
					</div>
					<span id="viewer-title" class="font-mono text-xs truncate flex-1 text-ink-700 dark:text-ink-100">
						{{ filename }}
					</span>
					<AppButton size="sm" @click="openExternal">
						Open externally
					</AppButton>
					<AppButton size="sm" @click="viewer.close()">
						Close
					</AppButton>
				</div>

				<!-- Body -->
				<div
					class="flex-1 min-h-0 overflow-auto bg-surface-50/60 dark:bg-surface-900/40
			            flex items-center justify-center">
					<img
						v-if="kind === 'image'"
						:src="assetUrl"
						:alt="filename"
						class="max-w-full max-h-full object-contain">

					<video
						v-else-if="kind === 'video'"
						:src="assetUrl"
						controls
						class="max-w-full max-h-full bg-black" />

					<audio
						v-else-if="kind === 'audio'"
						:src="assetUrl"
						controls
						class="w-full max-w-md mx-6" />

					<iframe
						v-else-if="kind === 'pdf'"
						:src="assetUrl"
						class="w-full h-full bg-white"
						title="PDF preview" />

					<pre
						v-else-if="kind === 'text' && textContent !== null"
						class="w-full h-full p-6 font-mono text-xs leading-relaxed
					       whitespace-pre-wrap break-words
					       text-ink-800 dark:text-ink-100">{{ textContent }}</pre>

					<div
						v-else-if="kind === 'text' && textError"
						class="p-6 text-center">
						<p class="font-serif text-lg text-ink-800 dark:text-ink-100">
							Could not read file
						</p>
						<p class="text-sm italic text-ink-500 dark:text-ink-300 mt-2 font-mono">
							{{ textError }}
						</p>
					</div>

					<div
						v-else-if="kind === 'text' && loadingText"
						class="p-6 italic text-sm text-ink-500 dark:text-ink-300">
						Loading…
					</div>

					<div v-else class="p-8 text-center">
						<p class="font-serif text-xl text-ink-800 dark:text-ink-100">
							Preview not available
						</p>
						<p class="text-sm italic text-ink-500 dark:text-ink-300 mt-2">
							<span class="font-mono">.{{ ext }}</span> files can't be previewed in-app.
						</p>
						<div class="mt-4">
							<AppButton size="sm" variant="primary" @click="openExternal">
								Open externally
							</AppButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>
