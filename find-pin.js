import https from 'node:https';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(get(res.headers.location));
      } else {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(data));
      }
    });
  });
}

get('https://pin.it/5eMsRAHqm').then(html => {
  const match = html.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9_\/]+\.(jpg|png|webp)/);
  console.log(match ? match[0] : 'not found');
});
