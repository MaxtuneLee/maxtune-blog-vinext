import { spawn } from "node:child_process";
import { cp, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const projectDir = process.cwd();
const cacheDir = path.join(projectDir, ".cache", "og-images");
const serverEntry = path.join(projectDir, "dist", "standalone", "server.js");
const bundledCacheDir = path.join(path.dirname(serverEntry), ".cache", "og-images");
const port = 20_000 + Math.floor(Math.random() * 20_000);
const origin = `http://127.0.0.1:${port}`;

async function publishedOgPaths() {
  const blogDir = path.join(projectDir, "content", "blog");
  const files = (await readdir(blogDir)).filter(
    file => /\.mdx?$/.test(file) && !file.startsWith("_")
  );
  const paths = ["/opengraph-image"];

  for (const file of files) {
    const raw = await readFile(path.join(blogDir, file), "utf8");
    if (matter(raw).data.draft) continue;

    const english = /\.en\.mdx?$/.test(file);
    const slug = file.replace(/(\.en)?\.mdx?$/, "");
    const prefix = english ? "/en" : "";
    paths.push(`${prefix}/posts/${encodeURIComponent(slug)}/opengraph-image`);
  }

  return paths;
}

async function waitUntilReady(child) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`standalone server exited with code ${child.exitCode}`);
    }
    try {
      const response = await fetch(`${origin}/robots.txt`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("standalone server did not become ready within 30 seconds");
}

await rm(cacheDir, { recursive: true, force: true });

const child = spawn(process.execPath, [serverEntry], {
  cwd: projectDir,
  env: {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: String(port),
    OG_IMAGE_CACHE_DIR: cacheDir,
  },
  stdio: ["ignore", "pipe", "pipe"],
});

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

try {
  await waitUntilReady(child);
  const paths = await publishedOgPaths();

  for (const pathname of paths) {
    const response = await fetch(new URL(pathname, origin), {
      signal: AbortSignal.timeout(90_000),
    });
    const type = response.headers.get("content-type") || "";
    if (!response.ok || !type.startsWith("image/png")) {
      throw new Error(`${pathname} returned ${response.status} ${type}`);
    }
    await response.arrayBuffer();
    console.log(`[og-prerender] ${response.headers.get("x-og-image-cache")} ${pathname}`);
  }

  await rm(bundledCacheDir, { recursive: true, force: true });
  await cp(cacheDir, bundledCacheDir, { recursive: true });
  console.log(
    `[og-prerender] generated ${paths.length} PNG files and bundled them in ${bundledCacheDir}`
  );
} finally {
  const exited = child.exitCode === null ? new Promise(resolve => child.once("exit", resolve)) : null;
  child.kill("SIGTERM");
  if (exited) await exited;
}
