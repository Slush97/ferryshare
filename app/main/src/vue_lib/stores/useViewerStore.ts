import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useViewerStore = defineStore('viewer', () => {
	const path = ref<string | null>(null);
	const isOpen = computed(() => path.value !== null);

	function open(p: string) {
		path.value = p;
	}
	function close() {
		path.value = null;
	}

	return { path, isOpen, open, close };
});
