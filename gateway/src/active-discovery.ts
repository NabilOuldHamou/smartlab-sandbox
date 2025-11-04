import dgram from "dgram";
import { prisma } from "./prisma-client.js";

const DISCOVERY_PORT = 41234;
const DISCOVERY_MSG = "DISCOVER_SMART_THINGS";

export async function runDiscovery(timeout = 5000) {
  const sock = dgram.createSocket("udp4");
  sock.bind(() => {
    sock.setBroadcast(true);
    sock.send(Buffer.from(DISCOVERY_MSG), DISCOVERY_PORT, "255.255.255.255");
  });

  sock.on("message", async (data, rinfo) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === "SMART_THING") {
        await prisma.appliance.create({
          data: {
            address: message.address,
            deviceId: message.deviceId,
            type: message.deviceType,
            capabilities: message.capabilities,
            preferences: message.preferences || {},
          },
        });
      }
    } catch (err) {
      console.warn(`Invalid response from ${rinfo.address}:`, data.toString());
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      sock.close();
      resolve(undefined);
    }, timeout);
  });
}
