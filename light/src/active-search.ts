import dgram from "dgram";
import { currentState, registration } from "./stateRegistry.js";
import "dotenv/config";

const DISCOVERY_PORT = 51234;

export async function searchForGateways(timeout = 10000) {
  const sock = dgram.createSocket("udp4");
  sock.bind(DISCOVERY_PORT, () => {
    console.log(`Listening for discovery on port ${DISCOVERY_PORT}`);
  });

  sock.on("message", async (msg, rinfo) => {
    if (!registration.registered) {
      let message;
      try {
        message = JSON.parse(msg.toString());
      } catch (err) {
        console.error("Failed to parse incoming message as JSON:", err);
        return;
      }
      if (message.type === "GATEWAY_ACTIVE_DISCOVERY") {
        console.log(
          "Received GATEWAY_ACTIVE_DISCOVERY. Preparing DEVICE_ACTIVE_SEARCH response."
        );
        const response = JSON.stringify({
          type: "DEVICE_ACTIVE_SEARCH", // for the active discovery
          address: process.env.DEVICE_ADDRESS!,
          deviceType: "light_bulb",
        });

        sock.send(Buffer.from(response), rinfo.port, rinfo.address, (err) => {
          if (err) {
            console.error("Error sending DEVICE_ACTIVE_SEARCH response:", err);
          } else {
            console.log(
              `Sent DEVICE_ACTIVE_SEARCH response to gateway at ${rinfo.address}:${rinfo.port}`
            );
          }
        });
      } else if (message.type === "DEVICE_REGISTRATION_ROUTE") {
        console.log(
          "Received DEVICE_REGISTRATION_ROUTE. Registering device with gateway."
        );
        registration.registered = true;
        const bodyObj = {
          address: process.env.DEVICE_ADDRESS!,
          type: "light_bulb",
          capabilities: {
            actions: {
              SET_POWER: { type: "boolean" },
            },
          },
          preferences: currentState,
        };
        try {
          const req = await fetch(message.route, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyObj),
          });
          console.log("Sent registration POST request to:", message.route);
          const data = await req.json();
          registration.registered = true;
          registration.id = data.device.id;
          console.log(
            "Device registered successfully. Assigned ID:",
            registration.id
          );
        } catch (err) {
          console.error("Error during device registration POST:", err);
        }
      } else if (message.type === "DEVICE_ALREADY_REGISTERED") {
        registration.registered = true;
        registration.id = message.id;
        currentState.brightness = message.savedState.brightness;
        currentState.color = message.savedState.color;
        currentState.power = message.savedState.power;
        console.log(
          "Device already registered. Using existing ID:",
          registration.id
        );
      } else {
        console.log("Received unknown message type:", message.type);
      }
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      sock.close();
      resolve(undefined);
    }, timeout);
  });
}
