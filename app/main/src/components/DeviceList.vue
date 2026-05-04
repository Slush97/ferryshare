<script setup lang="ts">
import { useTransfersStore } from '../vue_lib';
import DeviceCard from './DeviceCard.vue';

const transfers = useTransfersStore();
</script>

<template>
	<TransitionGroup name="fx-rise" tag="div" class="relative">
		<DeviceCard
			v-for="item in transfers.displayedItems"
			:key="item.id"
			:item="item" />
	</TransitionGroup>
</template>
