<script setup lang="ts">
import MotionController from "~/components/MotionController.vue";
import ThermometerController from "~/components/ThermometerController.vue";
import { socket } from "~/components/socket";
import { Spinner } from "~/components/ui/spinner";
import { useDevicesStore } from "~/stores/device.store";
definePageMeta({
  layout: "normal",
});

const deviceStore = useDevicesStore();

onMounted(() => {
  socket.on("device-event", async () => {
    await deviceStore.refreshDevices();
  });
});

onBeforeUnmount(() => {
  socket.off("device-event");
});
</script>

<template>
  <main class="w-full max-w-4xl mx-auto px-4">
    <div
      v-if="!deviceStore.isReady"
      class="h-[800px] flex items-center justify-center"
    >
      <Spinner class="size-16" />
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max"
    >
      <div v-for="d in deviceStore.devices" :key="d.id" class="w-full">
        <LightController v-if="d.type === 'light_bulb'" :device="d" />
        <MotionController v-else-if="d.type === 'motion_sensor'" :device="d" />
        <ThermometerController
          v-else-if="d.type === 'thermometer'"
          :device="d"
        />
      </div>
    </div>
  </main>
</template>
