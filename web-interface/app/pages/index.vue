<script setup lang="ts">
import MotionController from "~/components/MotionController.vue";
import { useDevicesStore } from "~/stores/device.store";
definePageMeta({
  layout: "normal",
});

const { devices, isReady } = useDevicesStore();
</script>

<template>
  <main class="w-full max-w-4xl mx-auto px-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <div v-for="d in devices" :key="d.id" class="w-full">
        <LightController v-if="d.type === 'light_bulb'" :device="d" />
        <MotionController v-else-if="d.type === 'motion_sensor'" :device="d" />
      </div>
    </div>
  </main>
</template>
