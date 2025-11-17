export default defineNuxtRouteMiddleware(async (to) => {
  const { status, token } = useAuth();
  const { loadDevices } = useDevicesStore();
  const { loadAutomations } = useAutomationsStore();

  if (
    (status.value === "unauthenticated" || !token.value) &&
    !["/auth/login", "/auth/register"].includes(to.path)
  ) {
    return navigateTo("/auth/login");
  }

  if (status.value === "authenticated") {
    await loadDevices();
    await loadAutomations();
  }

  if (
    status.value === "authenticated" &&
    ["/auth/login", "/auth/register"].includes(to.path)
  ) {
    return navigateTo("/");
  }
});
