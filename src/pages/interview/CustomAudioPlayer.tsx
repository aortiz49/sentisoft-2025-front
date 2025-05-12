/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/button';

type CustomAudioPlayerProps = {
  audioURL: string;
};

export default function CustomAudioPlayer({
  audioURL,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset states when audio URL changes
    setIsPlaying(false);
    setElapsedTime(0);
    setDuration(0);
    setIsLoading(true);

    const updateTime = () => setElapsedTime(audio.currentTime);

    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        console.log('Metadata loaded, duration:', audio.duration);
        setDuration(audio.duration);
        setIsLoading(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setElapsedTime(0);
    };

    // Add a small delay to ensure the audio element has time to process the blob
    setTimeout(() => {
      // Handle the case where metadata doesn't load automatically
      if (audio.readyState >= 2 && isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsLoading(false);
      } else {
        // Try to manually calculate duration by loading the full file
        // This is especially helpful for blob URLs
        fetch(audioURL)
          .then((response) => response.blob())
          .then((blob) => {
            // For a typical audio recording at 128kbps
            // Rough estimate: 1 second ≈ 16KB (128kbps / 8 = 16KBps)
            const estimatedDuration = blob.size / 16000;
            console.log(
              'Estimated duration from blob size:',
              estimatedDuration
            );
            setDuration(estimatedDuration);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Error estimating duration:', err);
            setIsLoading(false);
          });
      }
    }, 500);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Force load the audio
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioURL]);

  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current
        ?.play()
        .catch((err) => console.error('Playback error:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    // Ensure seconds is a valid number
    if (!isFinite(seconds) || isNaN(seconds)) {
      seconds = 0;
    }

    seconds = Math.max(0, seconds || 0);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        className="bg-blue-500"
        isDisabled={isLoading}
        radius="full"
        onPress={togglePlayback}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <span className="text-sm font-mono">
        {isLoading
          ? 'Loading...'
          : `${formatTime(elapsedTime)} / ${formatTime(duration)}`}
      </span>
      <audio
        ref={audioRef}
        preload="metadata"
        src={audioURL}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
