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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset states when audio URL changes
    setIsPlaying(false);
    setElapsedTime(0);
    setDuration(0);

    const updateTime = () => setElapsedTime(audio.currentTime);

    const handleLoadedMetadata = () => {
      console.log('Metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
    };

    // Create a new audio element to force metadata loading
    const loadAudio = () => {
      const tempAudio = new Audio(audioURL);
      tempAudio.addEventListener('loadedmetadata', () => {
        setDuration(tempAudio.duration);
        console.log('Temp audio duration:', tempAudio.duration);
      });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleLoadedMetadata);

    // Try to get duration directly
    if (audio.readyState > 0) {
      handleLoadedMetadata();
    } else {
      // Fallback method
      loadAudio();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleLoadedMetadata);
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
    seconds = Math.max(0, seconds || 0);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button className="bg-blue-500" radius="full" onPress={togglePlayback}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <span className="text-sm font-mono">
        {formatTime(elapsedTime)} / {formatTime(duration)}
      </span>
      <audio
        ref={audioRef}
        preload="metadata"
        src={audioURL}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
      />
    </div>
  );
}
