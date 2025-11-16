<script setup lang="ts">
import Card from "./ui/card/Card.vue";
import CardContent from "./ui/card/CardContent.vue";
import CardHeader from "./ui/card/CardHeader.vue";
import CardTitle from "./ui/card/CardTitle.vue";
import Input from "./ui/input/Input.vue";
import { cn } from "~/lib/utils";

const { renameDevice } = useDevicesStore();
const props = defineProps<{
  device: Device;
}>();

const deviceName = ref(props.device.name);
const deviceState = ref(props.device.preferences.motionDetected);

watch(
  () => props.device.name,
  (newName) => {
    deviceName.value = newName;
  }
);

watch(
  () => props.device.preferences.motionDetected,
  (newState) => {
    deviceState.value = newState;
  }
);

watch(
  () => deviceName.value,
  (newName) => {
    renameDevice(props.device.id, newName);
  }
);
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle class="flex items-center justify-between gap-2">
        <Input class="flex-1 min-w-0" v-model="deviceName" />
      </CardTitle>
    </CardHeader>
    <CardContent class="flex-1 flex items-center justify-center">
      <div
        :class="
          cn(
            'border-2 rounded-full w-24 h-24 flex items-center justify-center text-sm font-medium text-center',
            deviceState ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          )
        "
      >
        {{ deviceState ? "Motion\nDetected" : "No Motion" }}
      </div>
    </CardContent>
  </Card>
</template>
