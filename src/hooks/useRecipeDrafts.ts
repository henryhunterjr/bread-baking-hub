import { useState, useEffect, useCallback } from 'react';
import { recipeDrafts, type RecipeDraft } from '@/utils/recipeDrafts';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

export const useRecipeDrafts = () => {
  const { user } = useAuth();
  const [latestDraft, setLatestDraft] = useState<RecipeDraft | null>(null);
  const [loading, setLoading] = useState(false);

  // Load latest draft on mount
  useEffect(() => {
    if (user) {
      loadLatestDraft();
    }
  }, [user]);

  const loadLatestDraft = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const draft = await recipeDrafts.getLatestDraft();
      setLatestDraft(draft);
    } catch (error) {
      logger.error('Failed to load draft:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveDraft = useCallback(async (rawText: string, sourceType: 'text' | 'file' = 'text') => {
    if (!user) return false;
    
    const success = await recipeDrafts.saveDraft(rawText, sourceType);
    if (success) {
      // Reload to get latest
      await loadLatestDraft();
    }
    return success;
  }, [user, loadLatestDraft]);

  const deleteDraft = useCallback(async (draftId?: string) => {
    if (!user) return false;
    
    const success = await recipeDrafts.deleteDraft(draftId);
    if (success) {
      setLatestDraft(null);
    }
    return success;
  }, [user]);

  const clearAllDrafts = useCallback(async () => {
    if (!user) return false;
    
    const success = await recipeDrafts.clearAllDrafts();
    if (success) {
      setLatestDraft(null);
    }
    return success;
  }, [user]);

  return {
    latestDraft,
    loading,
    saveDraft,
    deleteDraft,
    clearAllDrafts,
    loadLatestDraft
  };
};