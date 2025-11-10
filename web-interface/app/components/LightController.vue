<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardFooter from "~/components/ui/card/CardFooter.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Slider from "~/components/ui/slider/Slider.vue";
import Switch from "~/components/ui/switch/Switch.vue";
const props = defineProps<{
  device: Device;
}>();

const { updateDevice } = useDevicesStore();

const deviceColor = ref(props.device.preferences.color);
const devicePower = ref(props.device.preferences.power);
const deviceBrightness = ref(props.device.preferences.brightness);

const submit = () => {
  updateDevice(props.device.id, {
    color: deviceColor.value,
    power: devicePower.value,
    brightness: deviceBrightness.value,
  });
};
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        Light Bulb
        <Switch
          :model-value="devicePower"
          @update:model-value="
            (val) => {
              devicePower = val ?? devicePower;
              submit();
            }
          "
        />
      </CardTitle>
    </CardHeader>
    <CardContent class="flex gap-6">
      <color-picker v-model="deviceColor" v-slot="{ show }" @change="submit">
        <button
          @click="show"
          type="button"
          class="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 shadow-sm"
          :style="'background-color: ' + deviceColor"
        ></button>
      </color-picker>
      <Slider
        :model-value="[deviceBrightness]"
        @update:model-value="
          (val) => {
            deviceBrightness = val?.[0] ?? deviceBrightness;
            submit();
          }
        "
        :min="1"
        :max="100"
        :step="1"
      />
    </CardContent>
    <CardFooter class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Brightness: {{ deviceBrightness }}
      </p>
    </CardFooter>
  </Card>
</template>
