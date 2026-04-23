import https from 'node:https';

const API_KEY = "ptla_WKMXC7QZlIfhBJJckJmIfqVDvr9UbUgU9NUJHZ2SQVN";
const BASE_URL = "https://panel.sterro.cloud";

async function testApi() {
  console.log('Testing Pterodactyl API Key...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'panel.sterro.cloud',
      path: '/api/application/nodes',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('API Key is valid. Found nodes:', json.data.length);
          } else {
            console.log('API Key might be invalid or has insufficient permissions.');
            console.log('Error Response:', json);
          }
        } catch (e) {
          console.log('Response is not JSON or is empty:', data);
        }
        resolve(res.statusCode);
      });
    });

    req.on('error', (e) => {
      console.error('Request Error:', e);
      resolve(500);
    });

    req.end();
  });
}

testApi();
