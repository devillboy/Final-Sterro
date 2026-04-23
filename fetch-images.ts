import https from "node:https";

const queryStrings = ["minecraft", "server+rack", "datacenter"];

queryStrings.forEach(query => {
  https.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=5`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`\nRESULTS FOR ${query}:`);
        json.results.forEach((r: any) => {
          console.log(r.urls.regular);
        });
      } catch (e) {
        console.error("error", e);
      }
    });
  });
});
