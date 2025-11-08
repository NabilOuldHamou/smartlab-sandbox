<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
const { signIn } = useAuth();

const test = async () => {
  const credentials = {
    email: "nouldhamou@unboz.dev",
    password: "1234",
  };

  const caca = await signIn(credentials, {
    redirect: false,
  });

  console.log(caca);
};
</script>

<template>
  <Button @click="test">Sign In</Button>
</template>
