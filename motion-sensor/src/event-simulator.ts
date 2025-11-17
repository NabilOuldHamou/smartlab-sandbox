import { currentState, registration } from "./stateRegistry.js";

export async function checkMovement() {
  let motionDetected = false;
  if (Math.random() < 0.4) {
    console.log("Motion detected!");
    motionDetected = true;
  }

  if (motionDetected) {
    if (!currentState.motionDetected) {
      currentState.motionDetected = true;
      currentState.lastSeen = Date.now();

      await fetch(registration.eventRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registration.token}`,
        },
        body: JSON.stringify({
          event: {
            type: "MOTION_DETECTED",
            sensor: registration.id,
          },
          state: currentState,
        }),
      });
    }
  } else {
    if (
      currentState.motionDetected &&
      currentState.lastSeen &&
      Date.now() - currentState.lastSeen > 5000
    ) {
      console.log("No motion detected for 5 seconds. Resetting state.");
      currentState.motionDetected = false;
      currentState.lastSeen = null;

      await fetch(registration.eventRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registration.token}`,
        },
        body: JSON.stringify({
          event: {
            type: "NO_MOTION_DETECTED",
            sensor: registration.id,
          },
          state: currentState,
        }),
      });
    }
  }
}
