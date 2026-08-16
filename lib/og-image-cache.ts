import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CACHE_DIR = path.join(process.cwd(), ".cache", "og-images");
const inFlight = new Map<string, Promise<CachedPng>>();

type CachedPng = {
  bytes: Uint8Array;
  headers: Headers;
};

function cacheDir() {
  return process.env.OG_IMAGE_CACHE_DIR || DEFAULT_CACHE_DIR;
}

function cacheFile(cacheKey: string) {
  const digest = createHash("sha256").update(cacheKey).digest("hex");
  return path.join(cacheDir(), `${digest}.png`);
}

function pngResponse(png: CachedPng, cacheStatus: "HIT" | "MISS") {
  const headers = new Headers(png.headers);
  headers.set("content-type", "image/png");
  headers.set("content-length", String(png.bytes.byteLength));
  headers.set("cache-control", "public, max-age=0, must-revalidate");
  headers.set("x-og-image-cache", cacheStatus);
  return new Response(new Uint8Array(png.bytes), { headers });
}

async function readCachedPng(file: string): Promise<CachedPng | null> {
  try {
    const bytes = await readFile(file);
    return { bytes: new Uint8Array(bytes), headers: new Headers() };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function generateAndStore(
  file: string,
  generate: () => Promise<Response> | Response
): Promise<CachedPng> {
  const generated = await generate();
  if (!generated.ok) {
    throw new Error(`OG image generation failed with HTTP ${generated.status}`);
  }

  const bytes = new Uint8Array(await generated.arrayBuffer());
  const result = { bytes, headers: new Headers(generated.headers) };

  try {
    await mkdir(path.dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
    await writeFile(temporary, bytes);
    try {
      await rename(temporary, file);
    } catch (error) {
      await unlink(temporary).catch(() => undefined);
      // Another worker may have completed the same image first.
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
  } catch (error) {
    // A read-only or full filesystem must not turn a valid image into a 500.
    console.error("[og-image-cache] Failed to persist generated PNG", error);
  }

  return result;
}

/**
 * Returns a PNG from the process-independent disk cache, or generates and
 * atomically stores it on a miss. The cache key should include every input
 * that changes the rendered image.
 */
export async function getCachedOgImage(
  cacheKey: string,
  generate: () => Promise<Response> | Response
): Promise<Response> {
  const file = cacheFile(cacheKey);
  const cached = await readCachedPng(file);
  if (cached) return pngResponse(cached, "HIT");

  let pending = inFlight.get(file);
  if (!pending) {
    pending = generateAndStore(file, generate).finally(() => inFlight.delete(file));
    inFlight.set(file, pending);
  }

  return pngResponse(await pending, "MISS");
}
