import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface RecipeDraft {
  id: string;
  user_id: string;
  raw_text: string;
  source_type: 'text' | 'file';
  created_at: string;
  updated_at: string;
}

export const recipeDrafts = {
  // Save or update a draft
  async saveDraft(rawText: string, sourceType: 'text' | 'file' = 'text'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user has an existing draft
      const { data: existingDrafts } = await supabase
        .from('recipe_drafts')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (existingDrafts && existingDrafts.length > 0) {
        // Update existing draft
        const { error } = await supabase
          .from('recipe_drafts')
          .update({
            raw_text: rawText,
            source_type: sourceType,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDrafts[0].id);

        if (error) {
          logger.error('Failed to update draft:', error);
          return false;
        }
      } else {
        // Create new draft
        const { error } = await supabase
          .from('recipe_drafts')
          .insert({
            user_id: user.id,
            raw_text: rawText,
            source_type: sourceType
          });

        if (error) {
          logger.error('Failed to create draft:', error);
          return false;
        }
      }

      logger.log('Draft saved successfully');
      return true;
    } catch (error) {
      logger.error('Draft save error:', error);
      return false;
    }
  },

  // Get the latest draft for the user
  async getLatestDraft(): Promise<RecipeDraft | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('recipe_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        logger.error('Failed to fetch draft:', error);
        return null;
      }

      return data && data.length > 0 ? data[0] as RecipeDraft : null;
    } catch (error) {
      logger.error('Draft fetch error:', error);
      return null;
    }
  },

  // Delete a draft (called after successful recipe creation)
  async deleteDraft(draftId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      let query = supabase.from('recipe_drafts').delete().eq('user_id', user.id);
      
      if (draftId) {
        query = query.eq('id', draftId);
      } else {
        // Delete latest draft if no ID provided
        const latest = await this.getLatestDraft();
        if (!latest) return true;
        query = query.eq('id', latest.id);
      }

      const { error } = await query;

      if (error) {
        logger.error('Failed to delete draft:', error);
        return false;
      }

      logger.log('Draft deleted successfully');
      return true;
    } catch (error) {
      logger.error('Draft delete error:', error);
      return false;
    }
  },

  // Clear all drafts for the user
  async clearAllDrafts(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('recipe_drafts')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        logger.error('Failed to clear drafts:', error);
        return false;
      }

      logger.log('All drafts cleared successfully');
      return true;
    } catch (error) {
      logger.error('Draft clear error:', error);
      return false;
    }
  }
};