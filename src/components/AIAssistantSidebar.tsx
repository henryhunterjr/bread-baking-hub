import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAIChat } from '@/hooks/useAIChat';
import { VoiceControls } from './VoiceControls';
import { ChatMessage } from './ChatMessage';

interface AIAssistantSidebarProps {
  recipeContext?: any;
  isOpen: boolean;
  onToggle: () => void;
}

type AssistantMode = 'general' | 'tips' | 'substitutions' | 'scaling' | 'troubleshooting';

export const AIAssistantSidebar = ({ recipeContext, isOpen, onToggle }: AIAssistantSidebarProps) => {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, mode, setMode, sendMessage } = useAIChat({ recipeContext });
  const voiceControls = VoiceControls({ 
    onTranscript: setInput,
    disabled: isLoading 
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={onToggle}
          variant="hero"
          size="lg"
          className="rounded-full shadow-warm"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-warm z-40">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Baker's Helper
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={mode} onValueChange={(value: AssistantMode) => setMode(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select assistance mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Help</SelectItem>
              <SelectItem value="tips">Tips & Techniques</SelectItem>
              <SelectItem value="substitutions">Substitutions</SelectItem>
              <SelectItem value="scaling">Recipe Scaling</SelectItem>
              <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
            </SelectContent>
          </Select>

          {recipeContext && (
            <Badge variant="secondary" className="text-xs">
              Using current recipe context
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100%-140px)] p-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hello! I'm Baker's Helper. Ask me anything about baking!</p>
                  {recipeContext && (
                    <p className="text-sm mt-2">I can see your current recipe and provide specific advice.</p>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about baking..."
                disabled={isLoading}
                className="pr-12"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                {voiceControls.MicButton}
              </div>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              variant="hero"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};