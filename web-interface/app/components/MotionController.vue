<script setup lang="ts">
import { de } from "zod/locales";
import Card from "./ui/card/Card.vue";
import CardContent from "./ui/card/CardContent.vue";
import CardHeader from "./ui/card/CardHeader.vue";
import CardTitle from "./ui/card/CardTitle.vue";
import Input from "./ui/input/Input.vue";
import { cn } from "~/lib/utils";
import { socket } from "./socket";

const { renameDevice, refreshDevice } = useDevicesStore();
const props = defineProps<{
  device: Device;
}>();

const deviceName = ref(props.device.name);
const deviceState = ref(props.device.preferences.motionDetected);

socket.on("device-event", (data: any) => {
  if (data.deviceId === props.device.id) {
    deviceState.value = data.state.motionDetected;
    // refreshDevice(props.device.id); fix this later
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <Input
          class="w-4/5"
          v-model="device.name"
          @update:model-value="
            (val) => {
              deviceName = String(val ?? deviceName);
              renameDevice(device.id, deviceName);
            }
          "
        />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div
        :class="
          cn(
            'border-2 rounded-full w-30 h-30 flex items-center justify-center mx-auto text-sm',
            deviceState ? 'bg-green-500' : 'bg-red-500'
          )
        "
      >
        {{ deviceState ? "Motion Detected" : "No Motion" }}
      </div>
    </CardContent>
  </Card>
</template>
