import { defineStore } from "pinia";

export interface Device {
  id: string;
  name: string;
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
    override: 0,
    ticker: 0,
    tickerInterval: null as NodeJS.Timeout | null,
  }),
  getters: {
    isReady: (state) => state.initialized && !state.loading,
    isOverride: (state) => {
      state.ticker;
      return Date.now() - state.override < 30000;
    },
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
    async refreshDevices() {
      const { token } = useAuth();
      const result = await $fetch("http://localhost:3001/api/v1/devices", {
        method: "GET",
        headers: {
          Authorization: token.value!,
        },
      });
      this.devices = (result as any).devices;
    },
    async updateDevice(id: string, data: any) {
      this.override = Date.now();

      // Clear existing ticker if any
      if (this.tickerInterval) {
        clearInterval(this.tickerInterval);
      }

      // Start a ticker interval to trigger reactivity updates
      this.tickerInterval = setInterval(() => {
        this.ticker++;
        // Stop ticker if override has expired
        if (Date.now() - this.override >= 30000) {
          if (this.tickerInterval) {
            clearInterval(this.tickerInterval);
            this.tickerInterval = null;
          }
        }
      }, 500);

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
    async renameDevice(id: string, name: string) {
      const { token } = useAuth();
      const result = await $fetch(
        `http://localhost:3001/api/v1/devices/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token.value!,
          },
          body: { name },
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
