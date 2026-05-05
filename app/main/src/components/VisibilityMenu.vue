<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Visibility } from '@martichou/core_lib/bindings/Visibility';
import { Icon, useAppStore } from '../vue_lib';

const app = useAppStore();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const optionsRefs = ref<HTMLElement[]>([]);

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
function toggle() {
	open.value = !open.value;
	if (open.value) {
		nextTick(() => {
			const selectedIndex = OPTIONS.findIndex((o) => o.value === app.visibility);
			optionsRefs.value[selectedIndex >= 0 ? selectedIndex : 0]?.focus();
		});
	}
}

async function pick(v: Visibility) {
	close();
	if (v === app.visibility) return;
	await app.setVisibility(v);
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape' && open.value) {
		e.preventDefault();
		close();
		(root.value?.querySelector('button') as HTMLElement)?.focus();
	}
}

function onOptionKeydown(e: KeyboardEvent, index: number) {
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		const nextIndex = (index + 1) % OPTIONS.length;
		optionsRefs.value[nextIndex]?.focus();
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		const prevIndex = (index - 1 + OPTIONS.length) % OPTIONS.length;
		optionsRefs.value[prevIndex]?.focus();
	}
}

function onDocMouseDown(e: MouseEvent) {
	if (!open.value) return;
	if (root.value && !root.value.contains(e.target as Node)) close();
}

onMounted(() => document.addEventListener('mousedown', onDocMouseDown));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMouseDown));
</script>

<template>
	<div ref="root" class="relative min-w-0" @keydown="onKeydown">
		<button
			type="button"
			class="inline-flex items-center gap-2 h-10 px-3 rounded-md text-sm font-medium
			       max-w-full min-w-0
			       border border-surface-200 dark:border-surface-700
			       bg-surface-0 dark:bg-surface-800
			       hover:bg-accent-700/5 dark:hover:bg-accent-300/5
			       text-ink-700 dark:text-ink-100 transition-colors
			       focus-visible:ring-2 focus-visible:ring-accent-500 outline-none"
			:aria-expanded="open"
			aria-haspopup="listbox"
			@click="toggle">
			<span class="relative w-2 h-2 rounded-full shrink-0" :class="dotClass">
				<span
					v-if="app.visibility === 'Temporarily'"
					class="absolute inset-0 rounded-full animate-ping bg-amber-500" />
			</span>
			<span class="truncate">{{ trigger }}</span>
			<Icon
				name="chevron-right"
				:size="14"
				class="transition-transform shrink-0"
				:class="open ? 'rotate-[270deg]' : 'rotate-90'" />
		</button>

		<Transition name="fx-scale">
			<div
				v-if="open"
				role="listbox"
				class="paper-card absolute right-0 mt-2 w-72 z-20 rounded-md
				       border border-surface-200 dark:border-surface-700
				       overflow-hidden shadow-xl origin-top-right">
				<button
					v-for="(opt, i) in OPTIONS" :key="opt.value"
					ref="optionsRefs"
					type="button"
					role="option"
					:aria-selected="opt.value === app.visibility"
					class="w-full text-left px-4 py-3 text-sm transition-colors
				       hover:bg-accent-700/10 dark:hover:bg-accent-300/10
				       focus:bg-accent-700/10 dark:focus:bg-accent-300/10 focus:outline-none"
					:class="opt.value === app.visibility ? 'bg-accent-500/15 dark:bg-accent-400/15' : ''"
					@click="pick(opt.value)"
					@keydown="onOptionKeydown($event, i)">
					<div class="flex items-center justify-between">
						<span class="font-medium text-ink-800 dark:text-ink-100">{{ opt.label }}</span>
						<span v-if="opt.value === app.visibility" class="text-accent-700 dark:text-accent-300 text-xs">●</span>
					</div>
					<div class="text-xs text-ink-500 dark:text-ink-300 mt-0.5 italic">
						{{ opt.hint }}
					</div>
				</button>
			</div>
		</Transition>
	</div>
</template>
