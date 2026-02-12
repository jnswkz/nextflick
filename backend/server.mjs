import http from "http";
import path from "path";
import { promises as fs } from "fs";
import { spawn, spawnSync } from "child_process";
import WebTorrent from "webtorrent";

const PORT = Number(process.env.BACKEND_PORT || 4000);
const HOST = process.env.BACKEND_HOST || "0.0.0.0";
const DATA_PATH = path.join(process.cwd(), "data", "films.json");
const VIDEO_FILE_PATTERN = /\.(mp4|mkv|webm|mov|m4v)$/i;
const BROWSER_SAFE_VIDEO_PATTERN = /\.(mp4|webm|m4v)$/i;

const configuredFfmpegPath = process.env.FFMPEG_PATH?.trim();

const detectFfmpegPath = () => {
  if (configuredFfmpegPath) {
    return configuredFfmpegPath;
  }

  const locator = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(locator, ["ffmpeg"], { encoding: "utf8" });

  if (result.status !== 0) {
    return null;
  }

  const firstMatch = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  return firstMatch || "ffmpeg";
};

const FFMPEG_PATH = detectFfmpegPath();
const HAS_FFMPEG = Boolean(FFMPEG_PATH);

const torrentClient = new WebTorrent();
const torrentCache = new Map();

const withCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Accept-Ranges, Content-Length, Content-Range, Content-Type"
  );
};

const sendJson = (res, status, payload) => {
  withCors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const readFilms = async () => {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
  return Array.isArray(parsed) ? parsed : [];
};

const parseIdFromPath = (pathname) => {
  const prefix = "/api/stream/";
  if (!pathname.startsWith(prefix)) {
    return null;
  }

  const encodedId = pathname.slice(prefix.length);
  if (!encodedId) {
    return null;
  }

  try {
    return decodeURIComponent(encodedId);
  } catch {
    return encodedId;
  }
};

const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".mp4" || ext === ".m4v") return "video/mp4";
  if (ext === ".webm") return "video/webm";
  if (ext === ".mkv") return "video/x-matroska";
  if (ext === ".mov") return "video/quicktime";
  return "application/octet-stream";
};

const isBrowserSafeVideo = (filename) => BROWSER_SAFE_VIDEO_PATTERN.test(filename);

const pickVideoFile = (torrent) => {
  const videoFiles = torrent.files.filter((file) => VIDEO_FILE_PATTERN.test(file.name));
  if (videoFiles.length === 0) {
    return torrent.files[0] || null;
  }

  const browserSafeFiles = videoFiles.filter((file) => isBrowserSafeVideo(file.name));
  if (browserSafeFiles.length > 0) {
    return browserSafeFiles.sort((a, b) => b.length - a.length)[0];
  }

  return videoFiles.sort((a, b) => b.length - a.length)[0];
};

const getTorrent = async (magnetLink) => {
  const cached = torrentCache.get(magnetLink);
  if (cached) {
    return cached;
  }

  const torrentPromise = new Promise((resolve, reject) => {
    const torrent = torrentClient.add(magnetLink);

    const onReady = () => {
      cleanup();
      resolve(torrent);
    };

    const onError = (error) => {
      cleanup();
      torrentCache.delete(magnetLink);
      reject(error);
    };

    const cleanup = () => {
      torrent.off("ready", onReady);
      torrent.off("error", onError);
    };

    torrent.on("ready", onReady);
    torrent.on("error", onError);
  });

  torrentCache.set(magnetLink, torrentPromise);
  return torrentPromise;
};

const parseRange = (rangeHeader, totalLength) => {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return null;
  }

  const [startText, endText] = rangeHeader.replace("bytes=", "").split("-");
  const start = Number.parseInt(startText, 10);
  const end = endText ? Number.parseInt(endText, 10) : totalLength - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end < start || end >= totalLength) {
    return null;
  }

  return { start, end };
};

const streamFileWithRangeSupport = (req, res, file) => {
  const total = file.length;
  const range = parseRange(req.headers.range, total);
  const mimeType = getMimeType(file.name);

  withCors(res);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", mimeType);

  if (range) {
    const { start, end } = range;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Content-Length": String(chunkSize),
    });

    const stream = file.createReadStream({ start, end });
    stream.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(500);
      }
      res.end();
    });

    stream.pipe(res);
    return;
  }

  res.writeHead(200, { "Content-Length": String(total) });
  const stream = file.createReadStream();
  stream.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(500);
    }
    res.end();
  });

  stream.pipe(res);
};

const streamFileWithTranscode = (req, res, file) => {
  if (!HAS_FFMPEG || !FFMPEG_PATH) {
    sendJson(res, 503, {
      error:
        "FFmpeg is required to transcode HEVC/MKV torrents. Install FFmpeg or set FFMPEG_PATH to ffmpeg executable.",
    });
    return;
  }

  withCors(res);
  res.setHeader("Accept-Ranges", "none");
  res.setHeader("Content-Type", "video/mp4");
  res.writeHead(200);

  const sourceStream = file.createReadStream();
  const ffmpeg = spawn(
    FFMPEG_PATH,
    [
      "-loglevel",
      "error",
      "-i",
      "pipe:0",
      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "frag_keyframe+empty_moov+default_base_moof",
      "-f",
      "mp4",
      "pipe:1",
    ],
    { stdio: ["pipe", "pipe", "pipe"] }
  );

  let ffmpegError = "";

  ffmpeg.stderr.on("data", (chunk) => {
    ffmpegError += chunk.toString();
    if (ffmpegError.length > 2000) {
      ffmpegError = ffmpegError.slice(-2000);
    }
  });

  sourceStream.on("error", () => {
    ffmpeg.kill("SIGKILL");
    if (!res.writableEnded) {
      res.end();
    }
  });

  ffmpeg.on("error", () => {
    if (!res.writableEnded) {
      res.end();
    }
  });

  ffmpeg.on("close", (code) => {
    if (code !== 0) {
      console.error("FFmpeg exited with code", code, ffmpegError);
    }

    if (!res.writableEnded) {
      res.end();
    }
  });

  req.on("close", () => {
    sourceStream.destroy();
    ffmpeg.kill("SIGKILL");
  });

  sourceStream.pipe(ffmpeg.stdin);
  ffmpeg.stdout.pipe(res);
};

const handleStream = async (req, res, id) => {
  const films = await readFilms();
  const film = films.find((item) => item.id === id);

  if (!film) {
    sendJson(res, 404, { error: "Film not found." });
    return;
  }

  if (!film.magnetLink) {
    sendJson(res, 400, { error: "Film has no magnet link." });
    return;
  }

  const torrent = await getTorrent(film.magnetLink);
  const file = pickVideoFile(torrent);

  if (!file) {
    sendJson(res, 404, { error: "No video file found in torrent." });
    return;
  }

  if (isBrowserSafeVideo(file.name)) {
    streamFileWithRangeSupport(req, res, file);
    return;
  }

  streamFileWithTranscode(req, res, file);
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "OPTIONS") {
      withCors(res);
      res.writeHead(204);
      res.end();
      return;
    }

    if (url.pathname === "/health") {
      sendJson(res, 200, {
        status: "ok",
        ffmpegAvailable: HAS_FFMPEG,
        ffmpegPath: FFMPEG_PATH,
      });
      return;
    }

    if (url.pathname === "/api/films") {
      const films = await readFilms();
      sendJson(res, 200, { films });
      return;
    }

    const id = parseIdFromPath(url.pathname);
    if (req.method === "GET" && id) {
      await handleStream(req, res, id);
      return;
    }

    sendJson(res, 404, { error: "Not found." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected backend error.";
    sendJson(res, 500, { error: message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Torrent backend listening on http://${HOST}:${PORT}`);
  console.log(`FFmpeg ${HAS_FFMPEG ? "available" : "not found"}${FFMPEG_PATH ? `: ${FFMPEG_PATH}` : ""}`);
});

const shutdown = () => {
  server.close(() => {
    torrentClient.destroy(() => {
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
