import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function scan() {
    try {
        const nestRes = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nests`, {
            headers: { "Authorization": `Bearer ${PTERODACTYL_API_KEY}`, "Accept": "application/json" }
        });
        const nestData = await nestRes.json();
        for (const nest of nestData.data) {
            console.log(`Nest ${nest.attributes.id}: ${nest.attributes.name}`);
            const eggRes = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nests/${nest.attributes.id}/eggs`, {
                headers: { "Authorization": `Bearer ${PTERODACTYL_API_KEY}`, "Accept": "application/json" }
            });
            const eggData = await eggRes.json();
            for (const egg of eggData.data) {
                console.log(`  Egg ${egg.attributes.id}: ${egg.attributes.name} (Docker: ${egg.attributes.docker_image})`);
            }
        }
    } catch(e) { console.log(e); }
}
scan();
