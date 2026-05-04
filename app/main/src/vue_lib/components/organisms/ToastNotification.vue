<script setup lang="ts">
import { computed } from 'vue';
import { useToastStore } from '../../stores/useToastStore';
import ToastMessage from '../atoms/ToastMessage.vue';

const store = useToastStore();
const toasts = computed(() => store.toasts);

function removeToast(id: number) {
	store.removeToast(id);
}
</script>

<template>
	<TransitionGroup
		tag="div"
		name="fx-toast"
		class="fixed top-4 right-4 flex flex-col gap-3 z-50 w-72 max-w-[calc(100vw-2rem)]">
		<ToastMessage
			v-for="toast in toasts"
			:id="toast.id"
			:key="toast.id"
			:message="toast.message"
			:type="toast.type"
			@remove="removeToast" />
	</TransitionGroup>
</template>
