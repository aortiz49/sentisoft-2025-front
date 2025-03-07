/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/button';

interface CustomAudioPlayerProps {
  audioURL: string;
}

export default function CustomAudioPlayer({
  audioURL,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => setElapsedTime(audio.currentTime);

    audio.addEventListener('timeupdate', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button className="bg-blue-500" radius="full" onPress={togglePlayback}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
      <audio ref={audioRef} hidden src={audioURL} />
    </div>
  );
}
