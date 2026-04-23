import https from "node:https";

const ids = [
  "1627856013091-fed6e4e048eb",
  "1607853202273-797f1c22a38e",
  "1605901309584-818e25960b8f",
  "1558494949253-e5223abfb21a",
  "1544197150-b99a580bb7a8",
  "1504384308090-c894fdcc538d",
  "1518770660439-4636190af475",
  "1573164713619-24bf7efbf1b0", // Server
  "1612287239144-1e099ee51016" // Maybe game/server?
];

ids.forEach(id => {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=300&q=80`;
  https.get(url, (res) => {
    console.log(`${id}: ${res.statusCode}`);
  });
});
