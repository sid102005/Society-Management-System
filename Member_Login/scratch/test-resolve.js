const http = require("http");

const token = "58473ff74711d76c96741de276c9e9045092dc11437e5e34caa4d021ef579fc7";
const url = `http://localhost:3000/api/documents/share/resolve/${token}`;

http.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log("Status Code:", res.statusCode);
    console.log("Body:", data);
  });
}).on("error", (err) => {
  console.error("Error:", err.message);
});
