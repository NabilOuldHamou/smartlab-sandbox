<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";
import Dialog from "./ui/dialog/Dialog.vue";
import DialogContent from "./ui/dialog/DialogContent.vue";
import DialogDescription from "./ui/dialog/DialogDescription.vue";
import DialogHeader from "./ui/dialog/DialogHeader.vue";
import DialogTitle from "./ui/dialog/DialogTitle.vue";
import DialogTrigger from "./ui/dialog/DialogTrigger.vue";
import Select from "./ui/select/Select.vue";
import SelectTrigger from "./ui/select/SelectTrigger.vue";
import SelectValue from "./ui/select/SelectValue.vue";
import SelectContent from "./ui/select/SelectContent.vue";
import SelectGroup from "./ui/select/SelectGroup.vue";
import SelectLabel from "./ui/select/SelectLabel.vue";
import SelectItem from "./ui/select/SelectItem.vue";

const { devices } = useDevicesStore();

const selectedDeviceId = ref<string | null>();
const selectedEvent = ref<string | null>();

import { computed } from "vue";
const events = computed(() => {
  return devices.filter((device) => device.id === selectedDeviceId.value)[0]
    ?.capabilities.events;
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="cursor-pointer"><Plus /> Create</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create a new automation</DialogTitle>
        <DialogDescription>
          Choose from a variety of triggers and actions to set up your
          automation.
        </DialogDescription>
      </DialogHeader>
      <form>
        <div class="grid grid-rows-3 gap-2.5">
          <div class="flex gap-4 items-center">
            <p class="font-bold text-xl">WHEN</p>
            <Select v-model="selectedDeviceId">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Devices</SelectLabel>
                  <SelectItem
                    v-for="device in devices"
                    :key="device.id"
                    :value="device.id"
                  >
                    {{ device.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="flex gap-4 items-center">
            <p class="font-bold text-xl">IS</p>
            <Select v-model="selectedEvent" :disabled="events === undefined">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Events</SelectLabel>
                  <SelectItem
                    v-for="(item, index) in events"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <p class="font-bold text-xl">THEN</p>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
