import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function run() {
    try {
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/users`, {
            headers: {
                "Authorization": `Bearer ${PTERODACTYL_API_KEY}`,
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        const u = data.data.find(d => d.attributes.username === 'testtrial224');
        console.log("User id:", u.attributes.id);

        const allocResponse = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nodes/2/allocations?filter[server_id]=`, {
            headers: {
                "Authorization": `Bearer ${PTERODACTYL_API_KEY}`,
                "Accept": "application/json"
            }
        });
        const allocData = await allocResponse.json();
        const firstAlloc = allocData.data[0];
        console.log("Alloc id:", firstAlloc.attributes.id);

        const serverBody = {
            name: "test-server-bypass-deploy-2",
            user: u.attributes.id,
            egg: 4, 
            nest: 1, 
            docker_image: "ghcr.io/pterodactyl/yolks:java_17",
            startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
            environment: { 
                SERVER_JARFILE: "server.jar", 
                BUILD_NUMBER: "latest"
            },
            limits: { memory: 1024, swap: 0, disk: 1024, io: 500, cpu: 100 },
            feature_limits: { databases: 0, backups: 0, allocations: 1 },
            allocation: {
                default: firstAlloc.attributes.id
            }
        };

        const svrRes = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/servers`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(serverBody)
        });
        const text = await svrRes.text();
        console.log("Create Svr Response:", text);

    } catch(e) {
        console.error("Fetch Error:", e);
    }
}
run();
