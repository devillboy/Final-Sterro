import https from 'node:https';
import fs from 'node:fs';

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

const url = "https://i.pinimg.com/originals/cf/df/53/cfdf536ca3fa1a90c96c4d7ec55c65bc.jpg";
const dest = "./public/hero-bg.jpg";

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("Image downloaded successfully to public/hero-bg.jpg");
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error("Error downloading image:", err.message);
});
