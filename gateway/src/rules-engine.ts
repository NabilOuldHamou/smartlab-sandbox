import { prisma } from "./prisma-client.js";
import { logger } from "./logger.js";

async function set_power(params: any) {
  const actorId = params.actorId;
  const state = params.state;

  const device = await prisma.devices.findFirst({
    where: {
      id: actorId,
    },
  });

  if (!device) {
    logger.warn(`Device with id ${actorId} not found`);
    return;
  }

  const req = await fetch(device.address + "/api/v1/state", {
    method: "POST",
    body: JSON.stringify({
      power: state,
    }),
  });

  const newState = await req.json();

  await prisma.devices.update({
    where: {
      id: actorId,
    },
    data: {
      preferences: newState.currentState,
    },
  });
}
async function set_thermostat(params: any) {}

const actions = {
  SET_POWER: set_power,
  SET_THERMOSTAT: set_thermostat,
};

export async function evaluateRule(event: any) {
  const rules = await prisma.rules.findMany();
  for (const rule of rules) {
    const condition = rule.when as any;
    const thenActions = rule.then as any;
    if (condition.event == event.type && condition.sensorId == event.sensor) {
      console.log("Rule matched:", rule.id);
      const actionName = thenActions.action as keyof typeof actions;
      const actionFunc = actions[actionName];
      if (typeof actionFunc !== "function") continue;
      await actionFunc(thenActions.params);
      logger.info(`Executed action ${actionName} for rule ${rule.id}`);
    }
  }
}
