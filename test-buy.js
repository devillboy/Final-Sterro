import fetch from "node-fetch";

async function run() {
    try {
        const formData = new URLSearchParams();
        formData.append("email", "testbuy@example.com");
        formData.append("username", "testbuy123");
        formData.append("planName", "Plan One");
        formData.append("nodeId", "1");
        formData.append("amount", "100");
        formData.append("upiId", "test@upi");
        formData.append("utrId", "123456789012");
        formData.append("date", "2026-04-24");

        const response = await fetch("http://localhost:3000/api/verify-payment", {
            method: 'POST',
            // Need multipart/form-data for image... but I'll send no image instead? Or fake it.
        });
        const text = await response.text();
        console.log("Response:", text);
    } catch(e) {
        console.error("Fetch Error:", e);
    }
}
run();
