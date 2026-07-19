import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (request, response) => {
  const requestPath = normalize(decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname));
  const candidate = join(root, requestPath === "/" ? "index.html" : requestPath);
  let filePath = candidate;
  try {
    if (!(await stat(candidate)).isFile()) filePath = join(root, "index.html");
  } catch {
    filePath = join(root, "index.html");
  }
  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(4174, "127.0.0.1", () => {
  console.log("AI Fluency Navigator preview: http://127.0.0.1:4174/");
});
