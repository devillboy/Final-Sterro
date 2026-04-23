import https from 'node:https';
import fs from 'node:fs';

async function download() {
  // Resolve short link
  const longUrl = await new Promise((resolve) => {
    https.get('https://pin.it/5eMsRAHqm', (res) => resolve(res.headers.location));
  });
  
  console.log('Long URL:', longUrl);
  if (!longUrl) return;

  // Get page content
  const content = await new Promise((resolve) => {
    https.get(longUrl, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
  });

  // Extract original image URL
  const match = content.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9_\/]+\.(jpg|png|webp)/);
  console.log('Original Image URL:', match ? match[0] : 'not found');
  
  if (match) {
    if (!fs.existsSync('./public')) fs.mkdirSync('./public');
    const dest = "./public/hero-bg-new.jpg";
    const file = fs.createWriteStream(dest);
    https.get(match[0], (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log("Image downloaded successfully to public/hero-bg-new.jpg");
      });
    });
  }
}

download().catch(console.error);
