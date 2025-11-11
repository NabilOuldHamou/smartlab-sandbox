import { prisma } from "./prisma-client.js";

async function set_power_state(params: any) {
  // todo: update device state in database
  // todo: send command to device
}
async function set_thermostat(params: any) {}

const actions = {
  set_power_state: set_power_state,
  set_thermostat: set_thermostat,
};

export async function evaluateRule(event: any) {
  const rules = await prisma.rules.findMany();
  for (const rule of rules) {
    const condition = rule.when as any;
    if (
      condition &&
      condition.sensor === event.sensor &&
      condition.type === event.type
    ) {
      const thenActions = rule.then as any;
      if (!Array.isArray(thenActions)) continue;
      for (const actionObj of thenActions) {
        const actionName = actionObj.action as keyof typeof actions;
        const actionFunc = actions[actionName];
        if (typeof actionFunc !== "function") continue;
        await actionFunc(actionObj.params);
      }
    }
  }
}
