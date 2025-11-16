<script setup lang="ts">
import { MoreVertical, Trash2, Edit } from "lucide-vue-next";
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Button from "~/components/ui/button/Button.vue";
import Dialog from "~/components/ui/dialog/Dialog.vue";
import DialogContent from "~/components/ui/dialog/DialogContent.vue";
import DialogDescription from "~/components/ui/dialog/DialogDescription.vue";
import DialogHeader from "~/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "~/components/ui/dialog/DialogTitle.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Input from "~/components/ui/input/Input.vue";
import SelectGroup from "~/components/ui/select/SelectGroup.vue";
import SelectLabel from "~/components/ui/select/SelectLabel.vue";
import Switch from "~/components/ui/switch/Switch.vue";
import type { Automation } from "~/stores/automation.store";
import { computed } from "vue";

const props = defineProps<{
  automation: Automation;
}>();

const { deleteAutomation, updateAppConfig } = useAutomationsStore();
const { devices } = useDevicesStore();

const selectedAction = ref<string | undefined>();
const editDialogOpen = ref(false);

// Edit form state
const editName = ref(props.automation.name);
const editSelectedAction = ref(props.automation.then.action);
const editActionValue = ref(props.automation.then.params.state);

const sensors = computed(() => {
  return devices.filter((device) => device.capabilities.events !== undefined);
});

const actors = computed(() => {
  return devices.filter((device) => device.capabilities.actions !== undefined);
});

const selectedActorId = computed(() => {
  return props.automation.then.params.actorId;
});

const actions = computed(() => {
  const actor = actors.value.find((d) => d.id === selectedActorId.value);
  return actor?.capabilities.actions;
});

const actionNames = computed(() => {
  if (!actions.value) return [];
  return Object.keys(actions.value);
});

const actionParams = computed(() => {
  if (!editSelectedAction.value || !actions.value) return {};
  return actions.value[editSelectedAction.value] || {};
});

watch(selectedAction, async (value) => {
  if (value === "edit") {
    editDialogOpen.value = true;
  } else if (value === "delete") {
    if (confirm("Are you sure you want to delete this automation?")) {
      await deleteAutomation(props.automation.id!);
    }
    selectedAction.value = undefined;
  }
});

const submitEdit = async () => {
  const updateData = {
    name: editName.value,
    when: props.automation.when,
    then: {
      action: editSelectedAction.value,
      params: {
        ...props.automation.then.params,
        state: editActionValue.value,
      },
    },
  };

  await updateAppConfig(props.automation.id!, updateData);
  editDialogOpen.value = false;
  selectedAction.value = undefined;
};
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between gap-2">
          <span class="text-xl truncate">{{ automation.name }}</span>
          <Select v-model="selectedAction">
            <SelectTrigger
              class="w-auto h-auto p-1 border-0 hover:bg-accent rounded-md"
            >
              <MoreVertical class="w-5 h-5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="edit">
                <div class="flex items-center gap-2">
                  <Edit class="w-4 h-4" />
                  <span>Edit</span>
                </div>
              </SelectItem>
              <SelectItem value="delete">
                <div class="flex items-center gap-2">
                  <Trash2 class="w-4 h-4" />
                  <span>Delete</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="text-sm">
          <p class="flex items-center gap-2">
            <span class="font-bold text-foreground text-lg">WHEN</span>
            {{ automation.when.event }}
          </p>
        </div>
        <div class="text-sm">
          <p class="flex items-center gap-2">
            <span class="font-bold text-foreground text-lg">THEN</span>
            {{ automation.then.action }}
          </p>
        </div>
        <div class="text-sm">
          <p class="flex items-center gap-2">
            <span class="font-bold text-foreground text-lg">TO</span>
            {{ automation.then.params.state }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Edit Dialog -->
    <Dialog v-model:open="editDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Automation</DialogTitle>
          <DialogDescription>
            Modify your automation settings.
          </DialogDescription>
        </DialogHeader>
        <div class="grid grid-rows-3 gap-2.5">
          <div class="flex gap-4 items-center">
            <p class="font-bold text-xl">NAME</p>
            <Input type="text" v-model="editName" placeholder="Name..." />
          </div>

          <div class="flex gap-4 items-center">
            <p class="font-bold text-xl">ACTION</p>
            <Select v-model="editSelectedAction">
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
            v-if="editSelectedAction && Object.keys(actionParams).length > 0"
            class="flex gap-4 items-center"
          >
            <p class="font-bold text-xl">TO</p>
            <div class="flex flex-col gap-2 flex-1">
              <Switch
                v-if="actionParams.type === 'boolean'"
                v-model="editActionValue"
              />
              <Select
                v-else-if="Array.isArray(actionParams)"
                v-model="editActionValue"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    <SelectItem
                      v-for="(option, index) in actionParams"
                      :key="index"
                      :value="option"
                    >
                      {{ option }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            @click="submitEdit"
            v-if="editSelectedAction && Object.keys(actionParams).length > 0"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
