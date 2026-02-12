"use client";

import { useEffect, useRef, useState } from "react";

type WebTorrentPlayerProps = {
  magnetLink: string;
};

type TorrentLike = {
  destroy: (callback?: () => void) => void;
};

type TorrentFile = {
  name: string;
  renderTo: (target: HTMLVideoElement, cb: (error?: Error | null) => void) => void;
};

type Torrent = {
  files: TorrentFile[];
  progress: number;
  numPeers: number;
  on: (event: string, listener: () => void) => void;
};

type WebTorrentClient = {
  add: (magnetURI: string, onTorrent: (torrent: Torrent) => void) => TorrentLike;
  on: (event: string, listener: (error: Error) => void) => void;
  destroy: (callback?: () => void) => void;
};

type WebTorrentConstructor = new () => WebTorrentClient;

const VIDEO_FILE_PATTERN = /\.(mp4|mkv|webm|mov)$/i;

export default function WebTorrentPlayer({ magnetLink }: WebTorrentPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const clientRef = useRef<WebTorrentClient | null>(null);
  const torrentRef = useRef<TorrentLike | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [peers, setPeers] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupTorrent = async () => {
      setIsLoading(true);
      setProgress(0);
      setPeers(0);
      setError(null);

      try {
        const webTorrentModule = await import("webtorrent/dist/webtorrent.min.js");
        const WebTorrent =
          (webTorrentModule.default as WebTorrentConstructor | undefined) ||
          (webTorrentModule as unknown as WebTorrentConstructor);

        if (!mounted || !videoRef.current) {
          return;
        }

        const client = new WebTorrent();
        clientRef.current = client;

        client.on("error", (clientError) => {
          if (mounted) {
            setError(clientError.message || "Unable to initialize torrent client.");
            setIsLoading(false);
          }
        });

        torrentRef.current = client.add(magnetLink, (torrent) => {
          const targetFile =
            torrent.files.find((file) => VIDEO_FILE_PATTERN.test(file.name)) || torrent.files[0];

          if (!targetFile || !videoRef.current) {
            setError("No playable video file found in this torrent.");
            setIsLoading(false);
            return;
          }

          const updateStats = () => {
            if (!mounted) {
              return;
            }

            setProgress(Math.round(torrent.progress * 100));
            setPeers(torrent.numPeers);
            if (torrent.progress > 0) {
              setIsLoading(false);
            }
          };

          torrent.on("download", updateStats);
          torrent.on("wire", updateStats);
          torrent.on("done", () => {
            if (mounted) {
              setProgress(100);
              setIsLoading(false);
            }
          });

          targetFile.renderTo(videoRef.current, (renderError) => {
            if (renderError && mounted) {
              setError(renderError.message || "Unable to play this torrent stream.");
            }
            if (mounted) {
              setIsLoading(false);
            }
          });
        });
      } catch (setupError) {
        const message = setupError instanceof Error ? setupError.message : "Failed to load WebTorrent.";
        if (mounted) {
          setError(message);
          setIsLoading(false);
        }
      }
    };

    setupTorrent();

    return () => {
      mounted = false;
      torrentRef.current?.destroy();
      clientRef.current?.destroy();
      torrentRef.current = null;
      clientRef.current = null;
    };
  }, [magnetLink]);

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-border relative">
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {isLoading && !error ? (
        <p className="text-sm text-muted-foreground">Buffering torrent stream... {progress}%</p>
      ) : null}

      {!isLoading && !error ? (
        <p className="text-sm text-muted-foreground">Peers: {peers} | Downloaded: {progress}%</p>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
