<script setup lang="ts">
import { useDevicesStore } from "~/stores/device.store";

const { devices, isReady } = useDevicesStore();
</script>

<template>
  <div class="grid grid-cols-3">
    <div class="col-span-2 relative">
      <NuxtImg src="/floorplan.png" class="min-h-screen" />
      <div
        class="absolute top-[20%] left-[20%] z-50 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-600/70 px-3 py-1 rounded"
      >
        ROOM LIGHT
      </div>
    </div>
    <div class="py-10" v-for="d in devices" :key="d.id">
      <LightController :device="d" v-if="d.type == `light_bulb`" />
    </div>
  </div>
</template>
