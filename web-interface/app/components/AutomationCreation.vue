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
import Switch from "./ui/switch/Switch.vue";
import { computed } from "vue";
import {
  useAutomationsStore,
  type Automation,
} from "~/stores/automation.store";
import Input from "./ui/input/Input.vue";

const { devices } = useDevicesStore();
const { createAutomation } = useAutomationsStore();

const name = ref<string>("");
const selectedSensorId = ref<string | null>();
const selectedEvent = ref<string | null>();
const selectedActorId = ref<string | null>();
const selectedAction = ref<string | null>();
const actionValue = ref<any>();

const sensors = computed(() => {
  return devices.filter((device) => device.capabilities.events !== undefined);
});

const events = computed(() => {
  return devices.filter((device) => device.id === selectedSensorId.value)[0]
    ?.capabilities.events;
});

const actors = computed(() => {
  return devices.filter((device) => device.capabilities.actions !== undefined);
});

const actions = computed(() => {
  return devices.filter((device) => device.id === selectedActorId.value)[0]
    ?.capabilities.actions;
});

const actionNames = computed(() => {
  if (!actions.value) return [];
  const actionObj = Object.keys(actions.value);
  return actionObj;
});

const actionParams = computed(() => {
  if (!selectedAction.value || !actions.value) return {};
  return actions.value[selectedAction.value] || {};
});

const submitAutomation = async () => {
  const data: Automation = {
    name: name.value,
    when: {
      sensorId: selectedSensorId.value!,
      event: selectedEvent.value!,
    },
    then: {
      action: selectedAction.value!,
      params: {
        actorId: selectedActorId.value!,
        state: actionValue.value,
      },
    },
  };

  await createAutomation(data);
};
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
      <div class="grid grid-rows-3 gap-2.5">
        <div class="flex gap-4 items-center">
          <p class="font-bold text-xl">NAME</p>
          <Input type="text" v-model="name" placeholder="Name..." />
        </div>
        <div class="flex gap-4 items-center">
          <p class="font-bold text-xl">WHEN</p>
          <Select v-model="selectedSensorId">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Devices</SelectLabel>
                <SelectItem
                  v-for="device in sensors"
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
            <SelectTrigger class="w-[200px]">
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

        <div class="flex gap-4 items-center">
          <p class="font-bold text-xl">THEN</p>
          <Select
            v-model="selectedActorId"
            :disabled="selectedEvent === undefined"
          >
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Devices</SelectLabel>
                <SelectItem
                  v-for="device in actors"
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
          <p class="font-bold text-xl">DOES</p>
          <Select v-model="selectedAction" :disabled="actionNames.length === 0">
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Actions</SelectLabel>
                <SelectItem
                  v-for="actionName in actionNames"
                  :key="actionName"
                  :value="actionName"
                >
                  {{ actionName }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div
          v-if="selectedAction && Object.keys(actionParams).length > 0"
          class="flex gap-4 items-center"
        >
          <p class="font-bold text-xl">TO</p>
          <div class="flex flex-col gap-2 flex-1">
            <Switch
              v-if="actionParams.type === 'boolean'"
              v-model="actionValue"
            />
          </div>
        </div>

        <Button
          @click="submitAutomation"
          v-if="selectedAction && Object.keys(actionParams).length > 0"
        >
          Create Automation
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
