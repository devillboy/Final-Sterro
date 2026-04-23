import https from 'node:https';

async function resolve(url) {
  return new Promise((res) => {
    https.get(url, (r) => {
      if (r.headers.location) res(resolve(r.headers.location));
      else {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(d));
      }
    });
  });
}

resolve('https://pin.it/5eMsRAHqm').then(h => {
  const m = h.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9_\/]+\.(jpg|png|webp)/);
  if (m) console.log('IMAGE:' + m[0]);
  else console.log('NOT_FOUND');
});
