<script setup lang="ts">
import { FolderOpen, Plus, Zap } from "lucide-vue-next";
import AutomationCard from "~/components/AutomationCard.vue";
import Button from "~/components/ui/button/Button.vue";
import Empty from "~/components/ui/empty/Empty.vue";
import EmptyContent from "~/components/ui/empty/EmptyContent.vue";
import EmptyDescription from "~/components/ui/empty/EmptyDescription.vue";
import EmptyHeader from "~/components/ui/empty/EmptyHeader.vue";
import EmptyMedia from "~/components/ui/empty/EmptyMedia.vue";
import EmptyTitle from "~/components/ui/empty/EmptyTitle.vue";

const { automations, isReady } = useAutomationsStore();

definePageMeta({
  layout: "normal",
});
</script>
<template>
  <Empty v-if="!isReady && automations.length === 0">
    <EmptyHeader>
      <EmptyMedia variant="default">
        <Zap />
      </EmptyMedia>
      <EmptyTitle>You don't have any automations yet</EmptyTitle>
      <EmptyDescription>
        You haven't created any automations yet. Get started by creating your
        automation for your devices.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <AutomationCreation />
    </EmptyContent>
  </Empty>
  <main v-else class="w-full max-w-4xl mx-auto px-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <AutomationCard
        v-for="automation in automations"
        :key="automation.id"
        :automation="automation"
      />
      <AddAutomationCard />
    </div>
  </main>
</template>
