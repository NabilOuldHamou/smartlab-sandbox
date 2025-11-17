<script setup lang="ts">
import { PlugZap, AlertTriangle } from "lucide-vue-next";
import MotionController from "~/components/MotionController.vue";
import ThermometerController from "~/components/ThermometerController.vue";
import { socket } from "~/components/socket";
import Empty from "~/components/ui/empty/Empty.vue";
import EmptyContent from "~/components/ui/empty/EmptyContent.vue";
import EmptyDescription from "~/components/ui/empty/EmptyDescription.vue";
import EmptyHeader from "~/components/ui/empty/EmptyHeader.vue";
import EmptyMedia from "~/components/ui/empty/EmptyMedia.vue";
import EmptyTitle from "~/components/ui/empty/EmptyTitle.vue";
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
    <Transition name="slide-down">
      <div
        v-if="deviceStore.isOverride"
        class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg animate-pulse"
      >
        <div class="flex items-center justify-center gap-3 px-4 py-3">
          <AlertTriangle class="size-5 text-white flex-shrink-0" />
          <span class="text-white font-semibold">Manual Override Active</span>
          <AlertTriangle class="size-5 text-white flex-shrink-0" />
        </div>
      </div>
    </Transition>
    <div
      v-if="!deviceStore.isReady"
      class="h-[800px] flex items-center justify-center"
    >
      <Spinner class="size-16" />
    </div>
    <Empty v-else-if="deviceStore.devices.length === 0">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <PlugZap />
        </EmptyMedia>
        <EmptyTitle>You don't have any devices yet</EmptyTitle>
        <EmptyDescription>
          Turn on your devices and they will appear here automatically.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
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

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
