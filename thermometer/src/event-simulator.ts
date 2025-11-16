import { currentState, registration } from "./stateRegistry.js";

export async function checkTemperature() {
  await fetch(registration.eventRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${registration.token}`,
    },
    body: JSON.stringify({
      event: {
        type: "TEMPERATURE_CHECK",
        sensor: registration.id,
      },
      state: currentState,
    }),
  });

  if (
    (currentState.mode === "OFF" ||
      currentState.currentTemperature >= currentState.targetTemperature) &&
    currentState.heating === false
  ) {
    if (currentState.currentTemperature > 10) {
      currentState.currentTemperature -= Math.random() * 1.5;
    }
    return;
  }

  if (
    (currentState.mode === "COMFORT" || currentState.mode === "ECO") &&
    currentState.currentTemperature < currentState.targetTemperature &&
    currentState.heating === true
  ) {
    currentState.currentTemperature += Math.random() * 1.5;
    return;
  }

  if (
    currentState.currentTemperature < currentState.targetTemperature &&
    currentState.mode !== "OFF"
  ) {
    currentState.heating = true;
    return;
  } else {
    currentState.heating = false;
    return;
  }
}
