<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardDescription from "~/components/ui/card/CardDescription.vue";
import CardFooter from "~/components/ui/card/CardFooter.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Slider from "~/components/ui/slider/Slider.vue";
import Switch from "~/components/ui/switch/Switch.vue";

const refVariable = ref("#000");
const caca = ref(null);
caca.value = await $fetch("http://localhost:3001/api/v1/devices", {
  headers: {
    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtaDVlZzR2YzAwMDBrMm8wMHk0aXl1azgiLCJleHAiOjE3NjE1OTM5OTB9.jzeK53ysyO7WhmPL2vFYye_IA0GsrZAo1a3DKigyLfo"
  }
})

console.log(caca.value)

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
    <div class="py-10">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            Bedroom
            <Switch />
          </CardTitle>
          <CardDescription>light_bulb</CardDescription>
        </CardHeader>
        <CardContent class="flex gap-6">
          <color-picker
            v-model="refVariable"
            v-slot="{ show }"
            @change="console.log('New color:', $event)"
          >
            <button
              @click="show"
              type="button"
              class="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 shadow-sm"
              :style="'background-color: ' + refVariable"
            ></button>
          </color-picker>
          <Slider :default-value="[33]" :max="100" :step="1" />
        </CardContent>
        <CardFooter class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">room-lamp</p>
          <Button variant="outline">Reset preferences</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
