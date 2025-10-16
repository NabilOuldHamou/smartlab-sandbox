import dgram from 'dgram';

const DISCOVERY_PORT = 41234;
const DISCOVERY_MSG =  'DISCOVER_SMART_THINGS';

export async function runDiscovery(timeout = 5000) {
    const sock = dgram.createSocket('udp4');
    sock.bind(() => {
        sock.setBroadcast(true);
        sock.send(Buffer.from(DISCOVERY_MSG), DISCOVERY_PORT, '192.168.1.255');
    });

    sock.on('message', (data, rinfo) => {
        //todo
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            sock.close();
            resolve(undefined);
        }, timeout);
    });
}