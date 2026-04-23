import https from 'https';
https.get('https://www.pinterest.com/pin/11822017766985407/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const match = data.match(/https:\/\/i\.pinimg\.com\/originals\/[^"]+/);
    if(match) console.log(match[0]);
    else console.log('none');
  });
});
