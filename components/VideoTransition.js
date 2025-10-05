'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function VideoTransition({ videoSrc = '/animations/1.mp4', onComplete }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // Play the video
      video.play().catch(err => {
        console.error('Error playing video:', err);
        // If video fails to play, skip to next page
        onComplete();
      });

      // When video ends, call onComplete
      const handleEnded = () => {
        onComplete();
      };

      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [onComplete, videoSrc]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted={false}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/20"
      >
        Skip →
      </button>
    </motion.div>
  );
}
