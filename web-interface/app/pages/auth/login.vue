<script setup lang="ts">
import * as z from "zod";
import Card from "~/components/ui/card/Card.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import Button from "~/components/ui/button/Button.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
const { signIn } = useAuth();
const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    email: z.email(),
    password: z.string(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  const credentials = {
    email: values.email,
    password: values.password,
  };

  await signIn(credentials, {
    redirect: false,
  });

  router.push("/");
});
</script>

<template>
  <div class="pt-10 flex justify-center">
    <Card class="w-[450px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email..."
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password..."
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <p>
            You do not have an account ?
            <NuxtLink to="/auth/register">
              <span class="underline underline-offset-2 cursor-pointer"
                >Click here to Sign Up</span
              >
            </NuxtLink>
          </p>
          <Button class="cursor-pointer" type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
