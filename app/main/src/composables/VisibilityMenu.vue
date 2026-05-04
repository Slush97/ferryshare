<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Visibility } from '@martichou/core_lib/bindings/Visibility';
import { Icon, useAppStore } from '../vue_lib';

const app = useAppStore();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

interface Option {
	value: Visibility;
	label: string;
	hint: string;
}

const OPTIONS: Option[] = [
	{ value: 'Visible', label: 'Always visible', hint: 'Anyone nearby can request to share' },
	{ value: 'Invisible', label: 'Hidden', hint: "You'll be notified when someone tries to share" },
	{ value: 'Temporarily', label: 'Temporarily visible', hint: 'Visible for 1 minute, then auto-hides' },
];

const current = computed(() => OPTIONS.find((o) => o.value === app.visibility) ?? OPTIONS[0]);

const dotClass = computed(() => {
	switch (app.visibility) {
	case 'Visible':      return 'bg-accent-600 dark:bg-accent-300';
	case 'Invisible':    return 'bg-ink-500/50 dark:bg-ink-300/40';
	case 'Temporarily':  return 'bg-amber-600 dark:bg-amber-400';
	default:             return 'bg-ink-500/50 dark:bg-ink-300/40';
	}
});

const trigger = computed(() => {
	if (app.visibility === 'Temporarily') {
		return `${current.value.label} · ${app.temporarySecondsLeft}s`;
	}
	return current.value.label;
});

function close() { open.value = false; }
function toggle() { open.value = !open.value; }

async function pick(v: Visibility) {
	close();
	if (v === app.visibility) return;
	await app.setVisibility(v);
}

function onDocMouseDown(e: MouseEvent) {
	if (!open.value) return;
	if (root.value && !root.value.contains(e.target as Node)) close();
}

onMounted(() => document.addEventListener('mousedown', onDocMouseDown));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMouseDown));
</script>

<template>
	<div ref="root" class="relative">
		<button
			type="button"
			class="inline-flex items-center gap-2 h-10 px-3 rounded-md text-sm font-medium
			       border border-surface-200 dark:border-surface-700
			       bg-surface-0/70 dark:bg-surface-800/70
			       hover:bg-accent-700/5 dark:hover:bg-accent-300/5
			       text-ink-700 dark:text-ink-100 transition-colors"
			:aria-expanded="open"
			aria-haspopup="listbox"
			@click="toggle">
			<span class="relative w-2 h-2 rounded-full" :class="dotClass">
				<span
					v-if="app.visibility === 'Temporarily'"
					class="absolute inset-0 rounded-full animate-ping bg-amber-500" />
			</span>
			<span>{{ trigger }}</span>
			<Icon
				name="chevron-right"
				:size="14"
				class="transition-transform"
				:class="open ? 'rotate-[270deg]' : 'rotate-90'" />
		</button>

		<div
			v-if="open"
			role="listbox"
			class="paper-card absolute right-0 mt-2 w-72 z-20 rounded-md
			       border border-surface-200 dark:border-surface-700
			       overflow-hidden">
			<button
				v-for="opt in OPTIONS" :key="opt.value"
				type="button"
				role="option"
				:aria-selected="opt.value === app.visibility"
				class="w-full text-left px-4 py-3 text-sm transition-colors
				       hover:bg-accent-700/10 dark:hover:bg-accent-300/10"
				:class="opt.value === app.visibility ? 'bg-accent-500/15 dark:bg-accent-400/15' : ''"
				@click="pick(opt.value)">
				<div class="flex items-center justify-between">
					<span class="font-medium text-ink-800 dark:text-ink-100">{{ opt.label }}</span>
					<span v-if="opt.value === app.visibility" class="text-accent-700 dark:text-accent-300 text-xs">●</span>
				</div>
				<div class="text-xs text-ink-500 dark:text-ink-300 mt-0.5 italic">
					{{ opt.hint }}
				</div>
			</button>
		</div>
	</div>
</template>
