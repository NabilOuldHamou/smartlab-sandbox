<script setup lang="ts">
import AppSidebar from "~/components/AppSidebar.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full h-full pb-2">
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>
