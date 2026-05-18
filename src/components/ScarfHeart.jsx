import { useEffect, useRef } from 'react';
import './ScarfHeart.css';

/**
 * Heart-trail backdrop.
 * Video sits absolutely positioned behind whatever you pass as children.
 * Plays once when scrolled into view, then freezes on the last frame.
 */
export default function ScarfHeart({ children }) {
  const videoRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            video.play().catch(() => {
              // autoplay blocked — video stays parked on frame 0
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="heart-stage">
      <video
        ref={videoRef}
        className="heart-trail-video"
        src="/landing_heart.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="heart-stage-content">{children}</div>
    </div>
  );
}
