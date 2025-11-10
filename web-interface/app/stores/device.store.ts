import { defineStore } from "pinia";

export interface Device {
  id: string;
  address: string;
  type: string;
  capabilities: any;
  preferences: any;
}

export const useDevicesStore = defineStore("devices", {
  state: () => ({
    devices: [] as Device[],
    loading: false,
    initialized: false,
  }),
  getters: {
    isReady: (state) => state.initialized && !state.loading,
  },
  actions: {
    async loadDevices() {
      if (this.initialized || this.loading) {
        return this.devices;
      }

      this.loading = true;
      const { token } = useAuth();
      const result = await $fetch("http://localhost:3001/api/v1/devices", {
        method: "GET",
        headers: {
          Authorization: token.value!,
        },
      });

      this.devices = (result as any).devices;

      this.initialized = true;
      this.loading = false;
    },
    async updateDevice(id: string, data: any) {
      const { token } = useAuth();
      const result = await $fetch(
        `http://localhost:3001/api/v1/devices/${id}/action`,
        {
          method: "POST",
          headers: {
            Authorization: token.value!,
          },
          body: data,
        }
      );

      this.devices.forEach((device) => {
        if (device.id === id) {
          Object.assign(device, result);
        }
      });
    },
  },
});
