<script setup lang="ts">
import { FolderOpen, Plus, Zap } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
import Empty from "~/components/ui/empty/Empty.vue";
import EmptyContent from "~/components/ui/empty/EmptyContent.vue";
import EmptyDescription from "~/components/ui/empty/EmptyDescription.vue";
import EmptyHeader from "~/components/ui/empty/EmptyHeader.vue";
import EmptyMedia from "~/components/ui/empty/EmptyMedia.vue";
import EmptyTitle from "~/components/ui/empty/EmptyTitle.vue";

definePageMeta({
  layout: "normal",
});
</script>
<template>
  <Empty>
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
</template>
