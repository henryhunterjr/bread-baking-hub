import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAIChat } from '@/hooks/useAIChat';
import { VoiceControls } from './VoiceControls';
import { ChatMessage } from './ChatMessage';
import { VoiceInterface } from './VoiceInterface';

interface AIAssistantSidebarProps {
  recipeContext?: any;
  isOpen: boolean;
  onToggle: () => void;
}

type AssistantMode = 'general' | 'tips' | 'substitutions' | 'scaling' | 'troubleshooting';

export const AIAssistantSidebar = ({ recipeContext, isOpen, onToggle }: AIAssistantSidebarProps) => {
  const isMobile = useIsMobile();
  const isOnline = useNetworkStatus();
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
    if (!input.trim() || isLoading || !isOnline) return;
    
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
      <div className="fixed right-4 bottom-4 z-50">
        <div 
          onClick={onToggle}
          className="relative w-20 h-20 cursor-pointer transform transition-transform duration-200 hover:scale-105 touch-manipulation"
        >
          {/* Circular window frame */}
          <div className="absolute inset-0 rounded-full border-4 border-primary bg-background shadow-warm"></div>
          
          {/* Avatar image */}
          <img 
            src="/lovable-uploads/6b5f1503-9015-4968-bc0e-f3cab80e6b7d.png"
            alt="KRUSTY - Baker's Helper"
            className="w-full h-full rounded-full object-cover relative z-10"
            onError={(e) => {
              console.log('Avatar image failed to load');
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Avatar image loaded successfully');
            }}
          />
          
          {/* Fallback content if image doesn't load */}
          <div className="absolute inset-0 rounded-full bg-primary flex items-center justify-center z-5">
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 z-20"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute -top-12 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
          Chat with KRUSTY!
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'right-0 top-0'} ${isMobile ? 'w-full h-full' : 'h-full w-96'} bg-background ${isMobile ? '' : 'border-l border-border'} shadow-warm z-40`}>
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              KRUSTY - Baker's Helper
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="touch-manipulation"
            >
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
                  <p>Hello! I'm KRUSTY, your expert baking assistant. Ask me anything about baking!</p>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p>• Need help diagnosing your loaf?</p>
                    <p>• Looking for a recipe or tool?</p>
                    <p>• Want to explore what this site can do?</p>
                  </div>
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
                placeholder={isOnline ? "Ask about baking..." : "Offline - AI disabled"}
                disabled={isLoading || !isOnline}
                className="pr-12"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                {voiceControls.MicButton}
              </div>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading || !isOnline}
              variant="hero"
              className="touch-manipulation"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};