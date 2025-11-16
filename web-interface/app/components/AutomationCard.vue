<script setup lang="ts">
import { MoreVertical, Trash2, Edit } from "lucide-vue-next";
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Button from "~/components/ui/button/Button.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Automation } from "~/stores/automation.store";

const props = defineProps<{
  automation: Automation;
}>();

const { deleteAutomation } = useAutomationsStore();
const router = useRouter();

const selectedAction = ref<string | undefined>();

watch(selectedAction, async (value) => {
  if (value === "edit") {
    console.log("Edit automation:", props.automation.id);
    // router.push(`/automation/${props.automation.id}/edit`);
  } else if (value === "delete") {
    if (confirm("Are you sure you want to delete this automation?")) {
      await deleteAutomation(props.automation.id!);
    }
    selectedAction.value = undefined;
  }
});
</script>

<template>
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
</template>
