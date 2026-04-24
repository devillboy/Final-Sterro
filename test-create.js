import fetch from "node-fetch";

const PTERODACTYL_API_KEY = 'ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN';
const PTERODACTYL_PANEL_URL = 'https://panel.sterro.cloud';

async function run() {
    const allocResp = await fetch(PTERODACTYL_PANEL_URL + '/api/application/nodes/2/allocations?per_page=100', { headers: { Authorization: 'Bearer ' + PTERODACTYL_API_KEY, Accept: 'application/json' }});
    const allocData = await allocResp.json();
    const unassigned = allocData.data.find(d => !d.attributes.assigned);
    if (!unassigned) return console.log('no unassigned alloc');
    
    // Create User First!
    const userRes = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/users`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: "user_test_fake@example.com", username: "user_test_fake", first_name: "Test", last_name: "Fake", password: "Password123!" })
    });
    const userData = await userRes.json();
    if (!userRes.ok) console.log("USER FAILED:", userData);
    const userId = userData.attributes.id;

    const serverBody = {
        name: 'manual-alloc-test-2',
        user: userId, // new user id
        egg: 4, 
        nest: 1, 
        docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
        startup: 'java -Xms128M -XX:MaxRAMPercentage=95.0 -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}',
        environment: { 
            SERVER_JARFILE: 'server.jar', 
            BUILD_NUMBER: 'latest',
            MINECRAFT_VERSION: 'latest'
        },
        limits: { memory: 1024, swap: 0, disk: 1000, io: 500, cpu: 100 },
        feature_limits: { databases: 0, backups: 0, allocations: 0 },
        allocation: { default: unassigned.attributes.id }
    };

    const svrRes = await fetch(PTERODACTYL_PANEL_URL + '/api/application/servers', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + PTERODACTYL_API_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(serverBody)
    });
    if(!svrRes.ok) console.log("SVR FAILED:", await svrRes.text());
    else console.log("SVR CREATED", await svrRes.text());
}
run();
