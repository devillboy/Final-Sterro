import https from "node:https";

const url = "https://www.pinterest.com/pin/11822017766985407/";

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const urls = data.match(/https:\/\/i\.pinimg\.com\/[a-zA-Z0-9_\-\/\.]+\.jpg/g);
    if (urls) {
      console.log("Found:", Array.from(new Set(urls)));
      // Filter for originals if possible
      const originals = urls.filter(u => u.includes('originals'));
      if (originals.length > 0) {
          console.log("Originals:", Array.from(new Set(originals)));
      }
    } else {
      console.log("No images found");
    }
  });
});
