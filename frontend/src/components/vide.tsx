import { useEffect, useRef } from 'react';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const mediaSource = new MediaSource();
    const video = videoRef.current;
    if (!video) return;

    video.src = URL.createObjectURL(mediaSource);

    const socket = new WebSocket('ws://localhost:8089');
    let sourceBuffer: SourceBuffer;

    const handleSourceOpen = () => {
      try {
        sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001E"');

        socket.onmessage = (event: MessageEvent<ArrayBuffer>) => {
          const chunk = new Uint8Array(event.data);
          if (!sourceBuffer.updating) {
            sourceBuffer.appendBuffer(chunk);
          } else {
            const onUpdate = () => {
              sourceBuffer.removeEventListener('updateend', onUpdate);
              sourceBuffer.appendBuffer(chunk);
            };
            sourceBuffer.addEventListener('updateend', onUpdate);
          }
        };
      } catch (e) {
        console.error("Error adding source buffer:", e);
      }
    };

    mediaSource.addEventListener('sourceopen', handleSourceOpen);

    return () => {
      socket.close();
      mediaSource.removeEventListener('sourceopen', handleSourceOpen);
    };
  }, []);

  return (
    <video ref={videoRef} controls autoPlay width={640} />
  );
};

export default VideoPlayer;
