import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function run() {
    try {
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nests/1/eggs`, {
            headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Accept': 'application/json' },
        });

        const data = await response.json();
        const eggs = data.data.map(e => ({ id: e.attributes.id, name: e.attributes.name }));
        console.log("Eggs in Nest 1:", eggs);
    } catch (e) {
        console.error(e);
    }
}

run();
