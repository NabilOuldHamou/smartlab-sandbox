export default defineNuxtRouteMiddleware(async (to) => {
  const { status, token } = useAuth();
  const { loadDevices } = useDevicesStore();
  const { initialized, devices } = storeToRefs(useDevicesStore());

  if (
    (status.value === "unauthenticated" || !token.value) &&
    !["/auth/login", "/auth/register"].includes(to.path)
  ) {
    return navigateTo("/auth/login");
  }

  if (status.value === "authenticated" && devices.value.length === 0) {
    await loadDevices();
  }

  if (
    status.value === "authenticated" &&
    ["/auth/login", "/auth/register"].includes(to.path)
  ) {
    return navigateTo("/");
  }
});
