import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type AssistantMode = 'general' | 'tips' | 'substitutions' | 'scaling' | 'troubleshooting';

interface UseAIChatOptions {
  recipeContext?: any;
}

export const useAIChat = ({ recipeContext }: UseAIChatOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('general');
  const { toast } = useToast();

  const getModeSystemMessage = (mode: AssistantMode) => {
    const baseMessage = "You are Crusty, an expert baking assistant from 'Baking Great Bread at Home'. You are knowledgeable, friendly, and passionate about helping bakers succeed. Provide helpful, practical advice about baking.";
    
    switch (mode) {
      case 'tips':
        return baseMessage + " Focus on providing useful tips and techniques to improve baking results.";
      case 'substitutions':
        return baseMessage + " Focus on ingredient substitutions and alternatives for baking recipes.";
      case 'scaling':
        return baseMessage + " Focus on helping scale recipes up or down and adjusting baking times/temperatures.";
      case 'troubleshooting':
        return baseMessage + " Focus on diagnosing and solving common baking problems and issues. You can suggest they try the Crust & Crumb tool for visual diagnosis.";
      default:
        return baseMessage + " Answer any baking-related questions with expertise and enthusiasm. You can guide users to specific tools on the site when relevant.";
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('bakers-helper', {
        body: {
          message: userMessage.content,
          recipeContext,
          mode,
          systemMessage: getModeSystemMessage(mode)
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: "Error",
        description: "Failed to get response from Baker's Helper. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    mode,
    setMode,
    sendMessage
  };
};