import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { speak, stop, isPlaying } = useTextToSpeech();

  const handleSpeak = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(message.content);
    }
  };

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.role === 'assistant' && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-6 p-1"
            onClick={handleSpeak}
          >
            {isPlaying ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};