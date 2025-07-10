import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const InboxBadge = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_drafts')
          .select('id', { count: 'exact' })
          .eq('imported', false)
          .eq('discarded', false);

        if (error) {
          console.error('Error fetching draft count:', error);
          return;
        }

        setCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching draft count:', error);
      }
    };

    fetchCount();

    // Set up real-time subscription for changes
    const subscription = supabase
      .channel('ai_drafts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_drafts'
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (count === 0) return null;

  return (
    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
      {count}
    </Badge>
  );
};

export default InboxBadge;