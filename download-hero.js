import https from 'node:https';
import fs from 'node:fs';

const url = "https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69eba22c&is=69ea50ac&hm=c6d476ec6a7ff99fc9e25e3c6a89265701f71cbb92e998989f3321cd60eb25ab&";

https.get(url, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('./public/hero-bg-v4.jpg');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Image downloaded successfully: hero-bg-v4.jpg');
    });
  } else {
    console.error('Download failed with status:', res.statusCode);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
