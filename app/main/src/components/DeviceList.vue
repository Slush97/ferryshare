<script setup lang="ts">
import { useTransfersStore } from '../vue_lib';
import DeviceCard from './DeviceCard.vue';

const transfers = useTransfersStore();
</script>

<template>
	<DeviceCard
		v-for="item in transfers.displayedItems"
		:key="item.id"
		:item="item" />
</template>
