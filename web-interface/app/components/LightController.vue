<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardFooter from "~/components/ui/card/CardFooter.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Slider from "~/components/ui/slider/Slider.vue";
import Switch from "~/components/ui/switch/Switch.vue";
import Input from "./ui/input/Input.vue";
const props = defineProps<{
  device: Device;
}>();

const { updateDevice, renameDevice } = useDevicesStore();

const deviceColor = ref(props.device.preferences.color);
const devicePower = ref(props.device.preferences.power);
const deviceName = ref(props.device.name);
const deviceBrightness = ref(props.device.preferences.brightness);

watch(
  () => props.device.preferences.color,
  (newColor) => {
    deviceColor.value = newColor;
  }
);

watch(
  () => props.device.preferences.power,
  (newPower) => {
    devicePower.value = newPower;
  }
);

watch(
  () => props.device.name,
  (newName) => {
    deviceName.value = newName;
  }
);

watch(
  () => props.device.preferences.brightness,
  (newBrightness) => {
    deviceBrightness.value = newBrightness;
  }
);

watch(
  () => deviceColor.value,
  () => {
    submit();
  }
);

watch(
  () => devicePower.value,
  () => {
    submit();
  }
);

watch(
  () => deviceBrightness.value,
  () => {
    submit();
  }
);

watch(
  () => deviceName.value,
  (newName) => {
    renameDevice(props.device.id, newName);
  }
);

const submit = () => {
  updateDevice(props.device.id, {
    color: deviceColor.value,
    power: devicePower.value,
    brightness: deviceBrightness.value,
  });
};
</script>
<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle class="flex items-center justify-between gap-2">
        <Input class="flex-1 min-w-0" v-model="deviceName" />
        <Switch v-model="devicePower" />
      </CardTitle>
    </CardHeader>
    <CardContent class="flex-1 flex gap-4 flex-col justify-center">
      <color-picker v-model="deviceColor" v-slot="{ show }">
        <button
          @click="show"
          type="button"
          class="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 shadow-sm flex-shrink-0 mx-auto"
          :style="'background-color: ' + deviceColor"
        ></button>
      </color-picker>
      <div class="space-y-2">
        <Slider
          :model-value="[deviceBrightness]"
          @update:model-value="
            (val) => {
              deviceBrightness = val?.[0] ?? deviceBrightness;
            }
          "
          :min="1"
          :max="100"
          :step="1"
        />
        <p class="text-sm text-muted-foreground text-center">
          Brightness: {{ deviceBrightness }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
