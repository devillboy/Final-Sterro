const start = Date.now();
fetch('http://localhost:3000/api/trial/claim', {
  method: 'POST', 
  headers: {'Content-Type': 'application/json'}, 
  body: JSON.stringify({email:'test5@test.com',password:'pass',username:'test5',serverName:'Test Server'})
}).then(async r=>{
  console.log(r.status);
  console.log(await r.text());
  console.log('Time taken: ' + (Date.now() - start) + 'ms');
})
