const fs = require("fs");
const path = require("path");

const collectionPath = path.join(__dirname, "..", "postman-collection.json");
const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

function formatBody(body) {
  if (!body) return "None";
  if (body.mode === "raw" && body.raw) {
    try {
      return JSON.stringify(JSON.parse(body.raw), null, 2);
    } catch(e) {
      return body.raw;
    }
  }
  if (body.mode === "formdata" && body.formdata) {
    return body.formdata.map(p => {
      if (p.type === "file") return `${p.key}: [File: ${p.src || 'upload_file'}]`;
      return `${p.key}: "${p.value}"`;
    }).join("\n");
  }
  return "None";
}

let output = "# Postman API Testing Reference (IDs 36 - 57)\n\n";

function traverse(items) {
  for (const item of items) {
    if (item.item) {
      traverse(item.item);
    } else if (item.request) {
      const name = item.name;
      // Filter for IDs between 36 and 57
      const match = name.match(/\[ID-(\d+)\]/);
      if (match) {
        const id = parseInt(match[1], 10);
        if (id >= 36 && id <= 57) {
          const req = item.request;
          output += `## ${name}\n\n`;
          output += `- **Method:** \`${req.method}\`\n`;
          const urlStr = typeof req.url === 'string' ? req.url : (req.url.raw || "");
          output += `- **URL:** \`${urlStr}\`\n`;
          output += `- **Headers:**\n`;
          output += `  - \`Content-Type: application/json\` (if sending a JSON body)\n`;
          output += `  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.\n\n`;
          
          const bodyStr = formatBody(req.body);
          if (bodyStr !== "None") {
            output += `**Request Body:**\n\`\`\`json\n${bodyStr}\n\`\`\`\n\n`;
          } else {
            output += `**Request Body:** None (GET request or empty POST)\n\n`;
          }
          output += `---\n\n`;
        }
      }
    }
  }
}

traverse(collection.item);
fs.writeFileSync(path.join(__dirname, "..", "scratch", "requests-guide.md"), output, "utf8");
console.log("Guide generated successfully!");
