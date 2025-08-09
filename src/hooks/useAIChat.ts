import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchBlogPosts, stripHtml } from '@/utils/blogFetcher';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cards?: Array<{ id: string; title: string; excerpt: string; url: string }>;
  meta?: { hasMore?: boolean };
}

type AssistantMode = 'general' | 'tips' | 'substitutions' | 'scaling' | 'troubleshooting' | 'concierge';

interface UseAIChatOptions {
  recipeContext?: any;
}

export const useAIChat = ({ recipeContext }: UseAIChatOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('general');
  const { toast } = useToast();

  // Concierge state for blog search routing
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const getModeSystemMessage = (mode: AssistantMode) => {
    const baseMessage = "You are KRUSTY, an expert baking assistant from 'Baking Great Bread at Home'. You are knowledgeable, friendly, and passionate about helping bakers succeed. Provide helpful, practical advice about baking. Keep your responses conversational and natural, as if you're a real person talking to a friend about baking.";
    
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

    const handleConcierge = async (text: string) => {
      try {
        const isShowMore = /^show(\s+me)?\s+more/i.test(text);
        let query = lastSearchQuery;
        let page = currentPage + 1;

        if (!isShowMore) {
          query = text.trim();
          page = 1;
        } else if (!query) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "No previous search to show more. Try: ‘Find brioche articles’.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          return;
        }

        const perPage = 5;
        const response = await fetchBlogPosts(page, undefined, perPage, query || undefined);
        const posts = response.posts;

        if (!posts || posts.length === 0) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: isShowMore ? 'No more results.' : `No results found for “${query}”.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          return;
        }

        const cards = posts.map(p => ({
          id: String(p.id),
          title: stripHtml(p.title, 100),
          excerpt: stripHtml(p.excerpt, 50),
          url: p.link
        }));

        const hasMore = response.currentPage < response.totalPages;
        setLastSearchQuery(query!);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Here are the top results for “${query}”. I’m showing ${cards.length} of ${response.totalPages > 0 ? 'many' : cards.length}.`,
          timestamp: new Date(),
          cards,
          meta: { hasMore }
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Concierge blog search error:', error);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry — I had trouble searching the blog just now. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    };

    try {
      if (mode === 'concierge') {
        await handleConcierge(userMessage.content);
        return;
      }

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