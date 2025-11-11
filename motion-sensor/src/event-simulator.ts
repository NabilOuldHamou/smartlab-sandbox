import { currentState } from "./stateRegistry.js";

export function checkMovement() {
  let motionDetected = false;
  if (Math.random() < 0.3) {
    console.log("Motion detected!");
    motionDetected = true;
  }

  if (motionDetected) {
    if (!currentState.motionDetected) {
      currentState.motionDetected = true;
    }
    currentState.lastSeen = Date.now();
  } else {
    if (currentState.lastSeen && Date.now() - currentState.lastSeen > 5000) {
      console.log("No motion detected for 5 seconds. Resetting state.");
      currentState.motionDetected = false;
    }
  }
}
