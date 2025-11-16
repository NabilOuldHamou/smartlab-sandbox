import { defineStore } from "pinia";

export interface Automation {
  id?: string;
  name: string;
  when: {
    sensorId: string;
    event: string;
  };
  then: {
    action: string;
    params: {
      actorId: string;
      state: any;
    };
  };
}

export const useAutomationsStore = defineStore("automations", {
  state: () => ({
    automations: [] as Automation[],
    loading: false,
    initialized: false,
  }),
  getters: {
    isReady: (state) => state.initialized && !state.loading,
  },
  actions: {
    async loadAutomations() {
      if (this.initialized || this.loading) {
        return this.automations;
      }
      this.loading = true;
      const { token } = useAuth();
      const result = await $fetch("http://localhost:3001/api/v1/rules", {
        method: "GET",
        headers: {
          Authorization: token.value!,
        },
      });
      this.automations = (result as any).rules;
      this.initialized = true;
      this.loading = false;
    },
    async createAutomation(data: any) {
      const { token } = useAuth();
      const result = await $fetch("http://localhost:3001/api/v1/rules", {
        method: "POST",
        headers: {
          Authorization: token.value!,
        },
        body: data,
      });
      this.automations.push((result as any).rule);
    },
    async updateAppConfig(id: string, data: any) {
      const { token } = useAuth();
      const result = await $fetch(`http://localhost:3001/api/v1/rules/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token.value!,
        },
        body: data,
      });
      this.automations.forEach((automation) => {
        if (automation.id === id) {
          Object.assign(automation, (result as any).rule);
        }
      });
    },
    async deleteAutomation(id: string) {
      const { token } = useAuth();
      await $fetch(`http://localhost:3001/api/v1/rules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token.value!,
        },
      });
      this.automations = this.automations.filter(
        (automation) => automation.id !== id
      );
    },
  },
});
