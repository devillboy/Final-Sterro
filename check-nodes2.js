import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function checkNodes() {
    try {
        // Let's get node details
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nodes/2?include=allocations`, {
            headers: {
                "Authorization": `Bearer ${PTERODACTYL_API_KEY}`,
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        console.log("Node public:", data.attributes.public);
        console.log("Node maint:", data.attributes.maintenance_mode);
        console.log("Memory overallocated? allocated:", data.attributes.allocated_resources.memory, "limit:", data.attributes.memory);
        // Wait, why did the panel say "DaemonConnectionException"?
        
    } catch(e) {
        console.error("Fetch Error:", e);
    }
}
checkNodes();
