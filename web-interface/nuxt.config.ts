import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/image",
    "shadcn-nuxt",
    "nuxt-color-picker",
    "@sidebase/nuxt-auth",
    "@pinia/nuxt",
  ],
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  auth: {
    baseURL: "http://localhost:3001/api/v1",
    provider: {
      type: "local",
      session: {
        dataType: {
          id: "string",
          email: "string",
          username: "string",
        },
      },
      endpoints: {
        signIn: { path: "/auth/login", method: "post" },
        signUp: { path: "/auth/register", method: "post" },
        getSession: { path: "/auth/session", method: "get" },
      },
      token: {
        signInResponseTokenPointer: "/token",
        type: "Bearer",
        cookieName: "auth.token",
        headerName: "Authorization",
        maxAgeInSeconds: 1800,
        // sameSiteAttribute: 'none',
        // secureCookieAttribute: true,
        // httpOnlyCookieAttribute: false,
      },
    },
  },
});
