<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Input from "./ui/input/Input.vue";
import Slider from "~/components/ui/slider/Slider.vue";

const props = defineProps<{
  device: Device;
}>();

const { updateDevice, renameDevice } = useDevicesStore();

let submitTimeout: NodeJS.Timeout;
const debouncedSubmit = () => {
  clearTimeout(submitTimeout);
  submitTimeout = setTimeout(() => {
    submit();
  }, 500); // Only submit after 500ms of no changes
};

const deviceName = ref(props.device.name);
const currentTemperature = ref(props.device.preferences.currentTemperature);
const targetTemperature = ref(props.device.preferences.targetTemperature);
const heating = ref(props.device.preferences.heating);
const mode = ref(props.device.preferences.mode);

watch(
  () => props.device.name,
  (newName) => {
    deviceName.value = newName;
  }
);

watch(
  () => props.device.preferences.currentTemperature,
  (newTemp) => {
    currentTemperature.value = newTemp;
  }
);

watch(
  () => props.device.preferences.targetTemperature,
  (newTemp) => {
    targetTemperature.value = newTemp;
  }
);

watch(
  () => props.device.preferences.heating,
  (newHeating) => {
    heating.value = newHeating;
  }
);

watch(
  () => props.device.preferences.mode,
  (newMode) => {
    mode.value = newMode;
  }
);

watch(
  () => deviceName.value,
  (newName) => {
    renameDevice(props.device.id, newName);
  }
);

// Don't call submit on these watches - just update the local refs
// The device store will update from server events instead

const submit = async () => {
  await updateDevice(props.device.id, {
    mode: mode.value,
  });
};

const modes = ["OFF", "ECO", "COMFORT"];

const cycleMode = () => {
  const currentIndex = modes.indexOf(mode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  mode.value = modes[nextIndex] as "OFF" | "ECO" | "COMFORT";
  debouncedSubmit();
};
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle class="flex items-center justify-between gap-2">
        <Input class="flex-1 min-w-0" v-model="deviceName" />
      </CardTitle>
    </CardHeader>
    <CardContent class="flex-1 flex gap-4 flex-col justify-center">
      <!-- Current Temperature Display -->
      <div class="text-center space-y-1">
        <p class="text-sm text-muted-foreground">Current Temperature</p>
        <p class="text-3xl font-bold">{{ currentTemperature.toFixed(2) }}°C</p>
      </div>

      <!-- Target Temperature Slider -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">Target Temperature</p>
          <p class="text-lg font-semibold">
            {{ targetTemperature.toFixed(2) }}°C
          </p>
        </div>
      </div>

      <!-- Heating Status -->
      <div class="flex items-center justify-between p-2 rounded bg-gray-100">
        <p class="text-sm text-muted-foreground">Heating</p>
        <div
          :class="
            heating
              ? 'w-3 h-3 rounded-full bg-red-500'
              : 'w-3 h-3 rounded-full bg-gray-400'
          "
        ></div>
      </div>

      <!-- Mode Selection -->
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Mode</p>
        <button
          @click="cycleMode"
          class="w-full p-2 rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium text-sm transition-colors"
        >
          {{ mode }}
        </button>
      </div>
    </CardContent>
  </Card>
</template>
