/**
 * Minimal static file server for the exported site (out/).
 *
 * Serves the export under the configured base path, mirroring how GitHub
 * Pages hosts a project site at https://user.github.io/<repo>/.
 *
 * Usage:
 *   node scripts/serve-static.mjs [--port 4173] [--base /repo-name]
 *
 * The base path defaults to NEXT_PUBLIC_BASE_PATH, then "".
 */
import { createServer } from "node:http";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback;
};

const port = Number(getArg("--port", process.env.PORT ?? "4173"));
const rawBase = getArg("--base", process.env.NEXT_PUBLIC_BASE_PATH ?? "");
const base = rawBase === "/" ? "" : rawBase.replace(/\/+$/, "");
const root = join(process.cwd(), "out");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

function resolveFile(pathname) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  let filePath = join(root, safePath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }
  if (!existsSync(filePath) && existsSync(`${filePath}.html`)) {
    filePath = `${filePath}.html`;
  }
  return existsSync(filePath) && statSync(filePath).isFile() ? filePath : null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  let pathname = url.pathname;

  if (base) {
    if (pathname === base || pathname === `${base}/`) {
      pathname = "/";
    } else if (pathname.startsWith(`${base}/`)) {
      pathname = pathname.slice(base.length);
    } else {
      // Outside the base path — mimic GitHub Pages behaviour with a 404.
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 — outside base path");
      return;
    }
  }

  const filePath = resolveFile(pathname) ?? resolveFile("/404.html");

  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
    return;
  }

  const body = await readFile(filePath);
  const isNotFoundFallback = filePath.endsWith("404.html") && pathname !== "/404.html";
  res.writeHead(isNotFoundFallback ? 404 : 200, {
    "Content-Type": MIME_TYPES[extname(filePath)] ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });
  res.end(body);
});

server.listen(port, () => {
  console.log(
    `Serving ./out at http://localhost:${port}${base || ""}/ (base path: "${base || "/"}")`,
  );
});
