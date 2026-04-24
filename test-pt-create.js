import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function run() {
    try {
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/servers`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: "Test Server",
                user: 1, // Assume user 1 exists, usually admin
                egg: 4, 
                nest: 1, 
                docker_image: "ghcr.io/pterodactyl/yolks:java_17",
                startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
                environment: { SERVER_JARFILE: "server.jar", BUILD_NUMBER: "latest", MINECRAFT_VERSION: "latest" },
                limits: { memory: 1024, swap: 0, disk: 1000, io: 500, cpu: 100 },
                feature_limits: { databases: 0, backups: 0, allocations: 0 },
                deploy: {
                    locations: [1],
                    dedicated_ip: false,
                    port_range: []
                }
            })
        });

        const text = await response.text();
        console.log("Create Server Response:", text);
    } catch (e) {
        console.error(e);
    }
}

run();
