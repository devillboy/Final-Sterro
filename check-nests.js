import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function checkNests() {
    try {
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nests`, {
            headers: {
                "Authorization": `Bearer ${PTERODACTYL_API_KEY}`,
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch(e) {
        console.error("Fetch Error:", e);
    }
}
checkNests();
