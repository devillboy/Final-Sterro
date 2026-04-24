import fetch from "node-fetch";

async function run() {
    try {
        const response = await fetch("http://localhost:3000/api/trial/claim", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "testtrial224@example.com",
                password: "Password123!",
                username: "testtrial224",
                nodeId: "1"
            })
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch(e) {
        console.error("Fetch Error:", e);
    }
}
run();
