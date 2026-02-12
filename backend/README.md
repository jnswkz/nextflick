# Torrent Backend

This is a separate backend service for heavy torrent streaming.

## Run

From project root:

```bash
npm run backend:dev
```

Default URL: `http://localhost:4000`

## Endpoints

- `GET /health`
- `GET /api/films`
- `GET /api/stream/:id`
  - Browser-compatible sources (`mp4`, `webm`, `m4v`) are streamed with HTTP range support.
  - Unsupported sources (e.g. `mkv` + `HEVC/x265`) are transcoded on the fly to MP4 (`H.264/AAC`) using FFmpeg.

## Environment variables

- `BACKEND_HOST` default: `0.0.0.0`
- `BACKEND_PORT` default: `4000`
- `FFMPEG_PATH` optional explicit path to ffmpeg executable

Frontend should point to this backend with:

- `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`

## FFmpeg requirement for HEVC torrents

If your torrent is `HEVC/x265`, install FFmpeg first:

Windows (winget):

```bash
winget install Gyan.FFmpeg
```

Then restart terminal and backend:

```bash
npm run backend:dev
```

Verify backend sees FFmpeg:

```bash
curl http://localhost:4000/health
```

`ffmpegAvailable` should be `true`.
