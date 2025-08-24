import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface FormatRecipeResponse {
  ok: boolean;
  code?: string;
  message?: string;
  recipe?: any;
  source?: string;
  originalText?: string;
}

export interface SaveDraftParams {
  source: 'text' | 'file';
  raw_text: string;
  user_id?: string;
}

// Centralized API client for recipe formatting
export const recipeApiClient = {
  async formatRecipe(params: {
    source_type: 'text' | 'pdf' | 'image';
    text?: string;
    file?: File;
  }): Promise<FormatRecipeResponse> {
    try {
      let body: FormData | string;
      let headers: Record<string, string> = {};

      if (params.source_type === 'text' && params.text) {
        // Text-based request
        body = JSON.stringify({
          source_type: 'text',
          text: params.text
        });
        headers['Content-Type'] = 'application/json';
      } else if (params.file) {
        // File-based request
        const formData = new FormData();
        formData.append('file', params.file);
        body = formData;
      } else {
        throw new Error('Invalid parameters: either text or file must be provided');
      }

      const response = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/format-recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY'}`,
          ...headers
        },
        body
      });

      const data = await response.json();

      // The edge function now returns { ok: true/false, code?, message?, recipe? }
      if (data.ok === false) {
        return {
          ok: false,
          code: data.code,
          message: data.message || 'Unknown error occurred'
        };
      }

      // Handle legacy response format (for backwards compatibility)
      if (!response.ok && !data.ok) {
        const errorCode = data.code || 'UNKNOWN_ERROR';
        const errorMessage = data.error || data.message || `Request failed (${response.status})`;
        
        logger.error('Recipe format API error:', {
          status: response.status,
          statusText: response.statusText,
          error: data
        });

        return {
          ok: false,
          code: errorCode,
          message: errorMessage
        };
      }

      return {
        ok: true,
        recipe: data.recipe,
        source: data.source,
        originalText: data.originalText
      };

    } catch (error: any) {
      logger.error('Recipe format API exception:', error);
      return {
        ok: false,
        code: 'NETWORK_ERROR',
        message: error?.message || 'Network error occurred'
      };
    }
  },

  async saveDraft(params: SaveDraftParams): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || params.user_id;

      if (!userId) {
        logger.warn('Cannot save draft: no user ID available');
        return;
      }

      await supabase.from('format_jobs').insert({
        user_id: userId,
        source_type: params.source,
        raw_text: params.raw_text,
        status: 'failed',
        error_code: 'DRAFT_SAVE',
        error_detail: 'Auto-saved draft from failed format attempt'
      });

      logger.log('Draft saved successfully');
    } catch (error) {
      logger.error('Failed to save draft:', error);
      // Don't throw - draft saving is optional
    }
  }
};