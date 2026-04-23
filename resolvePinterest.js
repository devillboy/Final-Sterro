import https from 'node:https';

async function resolvePin(shortUrl) {
    return new Promise((resolve) => {
        https.get(shortUrl, (res) => {
            if (res.headers.location) {
                resolve(res.headers.location);
            } else {
                resolve(null);
            }
        });
    });
}

async function getOriginal(longUrl) {
    return new Promise((resolve) => {
        https.get(longUrl, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const match = data.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9_\/]+\.(jpg|png|webp)/);
                resolve(match ? match[0] : null);
            });
        });
    });
}

(async () => {
    const longUrl = await resolvePin('https://pin.it/6qHYhqoI6');
    console.log('Long:', longUrl);
    if (longUrl) {
        const original = await getOriginal(longUrl);
        console.log('Original:', original);
    }
})();
