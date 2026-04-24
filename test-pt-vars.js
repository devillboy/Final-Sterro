import fetch from "node-fetch";

const PTERODACTYL_API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const PTERODACTYL_PANEL_URL = "https://panel.sterro.cloud";

async function run() {
    try {
        const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/nests/1/eggs/4?include=variables`, {
            headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Accept': 'application/json' },
        });

        const data = await response.json();
        const vars = data.attributes.relationships.variables.data.map(v => ({
            env_variable: v.attributes.env_variable,
            default_value: v.attributes.default_value,
            rules: v.attributes.rules
        }));
        console.log("Paper Egg Variables:", vars);
    } catch (e) {
        console.error(e);
    }
}

run();
