import React, { useEffect, useRef } from 'react';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    if (video) {
      video.src = URL.createObjectURL(mediaSource);
    }

    const handleSourceOpen = () => {
      const mime = 'video/mp4; codecs="avc1.64001F, mp4a.40.2"';
 // Match your encoded format

      if (!MediaSource.isTypeSupported(mime)) {
        console.error('MIME type not supported:', mime);
        return;
      }

      const sourceBuffer = mediaSource.addSourceBuffer(mime);
      sourceBufferRef.current = sourceBuffer;

      const socket = new WebSocket('ws://localhost:8089');
      socket.binaryType = 'arraybuffer';

      socket.onmessage = (event: MessageEvent) => {
        const chunk = event.data as ArrayBuffer;
        if (!sourceBuffer.updating) {
          try {
            sourceBuffer.appendBuffer(new Uint8Array(chunk));
          } catch (err) {
            console.error('Append error:', err);
          }
        }
      };

      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };

      socketRef.current = socket;
    };

    mediaSource.addEventListener('sourceopen', handleSourceOpen);

    return () => {
      socketRef.current?.close();
      mediaSource.removeEventListener('sourceopen', handleSourceOpen);
    };
  }, []);

  return (
    <div>
      <h2>Kafka Video Stream</h2>
      <video ref={videoRef} width={640} height={360} controls autoPlay muted />
    </div>
  );
};

export default VideoPlayer;
