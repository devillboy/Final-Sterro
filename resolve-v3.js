import https from 'node:https';
import fs from 'node:fs';

function followRedirects(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Redirecting to:', res.headers.location);
        resolve(followRedirects(res.headers.location));
      } else {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(data));
      }
    }).on('error', reject);
  });
}

async function run() {
  const html = await followRedirects('https://pin.it/5eMsRAHqm');
  const match = html.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9_\/]+\.(jpg|png|webp)/);
  if (match) {
    const imageUrl = match[0];
    console.log('Found Image URL:', imageUrl);
    
    // Download it
    if (!fs.existsSync('./public')) fs.mkdirSync('./public');
    const dest = "./public/hero-bg-v3.jpg";
    const file = fs.createWriteStream(dest);
    https.get(imageUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log("Image downloaded successfully to public/hero-bg-v3.jpg");
      });
    });
  } else {
    console.log('Image URL not found in the page content.');
  }
}

run().catch(console.error);
