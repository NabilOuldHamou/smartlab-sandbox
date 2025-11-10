import dgram from "dgram";
import { prisma } from "./prisma-client.js";
import "dotenv/config";

const DISCOVERY_PORT = 51234;
const DISCOVERY_MSG = JSON.stringify({ type: "GATEWAY_ACTIVE_DISCOVERY" });

export async function runDiscovery(timeout = 5000) {
  const sock = dgram.createSocket("udp4");
  sock.bind(() => {
    sock.setBroadcast(true);
    sock.send(Buffer.from(DISCOVERY_MSG), DISCOVERY_PORT, "192.168.1.255");
  });

  sock.on("message", async (msg, rinfo) => {
    try {
      const message = JSON.parse(msg.toString());
      if (message.type === "DEVICE_ACTIVE_SEARCH") {
        const device = await prisma.devices.findFirst({
          where: {
            type: message.deviceType,
            address: message.address,
          },
        });

        if (device != null) {
          const res = JSON.stringify({
            type: "DEVICE_ALREADY_REGISTERED",
            gatewayAdress: process.env.GATEWAY_ADDRESS!,
            id: device.id,
            savedState: {
              brightness: (device.preferences! as any).brightness,
              color: (device.preferences! as any).color,
              power: (device.preferences! as any).power,
            },
          });

          sock.send(Buffer.from(res), rinfo.port, rinfo.address);
        } else {
          const route = JSON.stringify({
            type: "DEVICE_REGISTRATION_ROUTE",
            route: `${process.env.GATEWAY_ADDRESS!}/api/v1/discover`,
          });
          sock.send(Buffer.from(route), rinfo.port, rinfo.address);
        }
      }
    } catch (err) {
      console.warn(`Invalid response from ${rinfo.address}`, msg.toString());
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      sock.close();
      resolve(undefined);
    }, timeout);
  });
}
