import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function run() {
    try {
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/servers/8`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Accept': 'application/json' },
        });
        console.log("Delete Status:", response.status);
    } catch (e) {
        console.error(e);
    }
}

run();
