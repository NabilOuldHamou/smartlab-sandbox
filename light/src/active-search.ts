// simulatedDevice.js
import dgram from "dgram";
import { defaultSettings } from "./stateRegistry.js";

const DISCOVERY_PORT = 41234;

export async function searchForGateways(timeout = 3000) {
  const sock = dgram.createSocket("udp4");
  sock.bind(DISCOVERY_PORT, () => {
    console.log(`Listening for discovery on port ${DISCOVERY_PORT}`);
  });

  sock.on("message", (msg, rinfo) => {
    const text = msg.toString();
    if (text === "DISCOVER_SMART_THINGS") {
      const response = JSON.stringify({
        type: "SMART_THING",
        address: "test",
        deviceId: "living-room-light",
        deviceType: "light-bulb",
        capabilities: defaultSettings,
        preferences: defaultSettings,
      });

      sock.send(Buffer.from(response), rinfo.port, rinfo.address);
      console.log(`Responded to ${rinfo.address}:${rinfo.port}`);
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      sock.close();
      resolve(undefined);
    }, timeout);
  });
}
