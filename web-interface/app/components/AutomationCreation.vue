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
        <div class="grid grid-rows-3">
          <p>WHEN</p>
          <Select>
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
          <p>IS</p>
          <p>THEN</p>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
