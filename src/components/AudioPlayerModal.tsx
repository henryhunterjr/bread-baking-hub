import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BookData } from "@/data/books-data";

interface AudioPlayerModalProps {
  selectedBook: BookData | null;
  onClose: () => void;
}

const AudioPlayerModal = ({ selectedBook, onClose }: AudioPlayerModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedBook?.audioUrl) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setIsLoading(false);
      alert('Unable to load audio. Please try again later.');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [selectedBook]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        alert('Unable to play audio. Please try again later.');
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!selectedBook) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-2xl max-w-2xl w-full shadow-stone animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {selectedBook.title}
              </h1>
              <p className="text-lg text-muted-foreground italic">
                {selectedBook.subtitle}
              </p>
              <p className="text-md text-primary font-medium">
                By {selectedBook.author}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Book Cover and Audio Player */}
          <div className="px-6 pb-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <img 
                  src={selectedBook.coverImage} 
                  alt={selectedBook.title}
                  className="w-48 h-auto rounded-lg shadow-stone"
                />
              </div>

              {/* Audio Player */}
              <div className="flex-1 w-full">
                <div className="bg-card rounded-xl p-6 border">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">Audio Excerpt</h3>
                    <p className="text-sm text-muted-foreground">
                      Listen to a preview of this audiobook
                    </p>
                  </div>

                  {/* Playback Controls */}
                  <div className="space-y-4">
                    {/* Play/Pause Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={togglePlayPause}
                        disabled={isLoading}
                        size="lg"
                        className="w-16 h-16 rounded-full"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground min-w-[40px]">
                          {formatTime(currentTime)}
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={duration ? (currentTime / duration) * 100 : 0}
                          onChange={handleSeek}
                          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary 
                            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 
                            [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm
                            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                            [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer 
                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
                        />
                        <span className="text-xs text-muted-foreground min-w-[40px]">
                          {formatTime(duration)}
                        </span>
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 justify-center">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary 
                          [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 
                          [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm
                          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                          [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer 
                          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        {selectedBook.audioUrl && (
          <audio
            ref={audioRef}
            src={selectedBook.audioUrl}
            preload="metadata"
          />
        )}
      </div>
    </div>
  );
};

export default AudioPlayerModal;