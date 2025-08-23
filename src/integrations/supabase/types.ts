export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ab_assignments: {
        Row: {
          assigned_at: string
          experiment_id: string
          id: string
          session_id: string | null
          user_id: string | null
          variant_name: string
        }
        Insert: {
          assigned_at?: string
          experiment_id: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          variant_name: string
        }
        Update: {
          assigned_at?: string
          experiment_id?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_experiments: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          experiment_name: string
          id: string
          is_active: boolean | null
          start_date: string | null
          traffic_allocation: number | null
          updated_at: string
          variants: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          experiment_name: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          traffic_allocation?: number | null
          updated_at?: string
          variants: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          experiment_name?: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          traffic_allocation?: number | null
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
      ai_drafts: {
        Row: {
          created_at: string
          discarded: boolean
          id: string
          imported: boolean
          payload: Json
          run_date: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discarded?: boolean
          id?: string
          imported?: boolean
          payload: Json
          run_date?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discarded?: boolean
          id?: string
          imported?: boolean
          payload?: Json
          run_date?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_clicks: {
        Row: {
          category_names: string[] | null
          clicked_at: string
          created_at: string
          id: string
          post_id: string
          post_title: string
          post_url: string
          referrer_page: string | null
          user_id: string | null
        }
        Insert: {
          category_names?: string[] | null
          clicked_at?: string
          created_at?: string
          id?: string
          post_id: string
          post_title: string
          post_url: string
          referrer_page?: string | null
          user_id?: string | null
        }
        Update: {
          category_names?: string[] | null
          clicked_at?: string
          created_at?: string
          id?: string
          post_id?: string
          post_title?: string
          post_url?: string
          referrer_page?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_images_metadata: {
        Row: {
          alt_text: string
          created_at: string
          dimensions: Json | null
          file_path: string
          file_size: number | null
          filename: string
          id: string
          meta_description: string | null
          post_title: string | null
          public_url: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          dimensions?: Json | null
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          meta_description?: string | null
          post_title?: string | null
          public_url: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          dimensions?: Json | null
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          meta_description?: string | null
          post_title?: string | null
          public_url?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          hero_image_url: string | null
          id: string
          inline_image_url: string | null
          is_draft: boolean | null
          publish_as_newsletter: boolean | null
          published_at: string | null
          slug: string
          social_image_url: string | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          hero_image_url?: string | null
          id?: string
          inline_image_url?: string | null
          is_draft?: boolean | null
          publish_as_newsletter?: boolean | null
          published_at?: string | null
          slug: string
          social_image_url?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          hero_image_url?: string | null
          id?: string
          inline_image_url?: string | null
          is_draft?: boolean | null
          publish_as_newsletter?: boolean | null
          published_at?: string | null
          slug?: string
          social_image_url?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      collaboration_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          owner_id: string
          participants: Json | null
          recipe_id: string
          session_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          owner_id: string
          participants?: Json | null
          recipe_id: string
          session_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          owner_id?: string
          participants?: Json | null
          recipe_id?: string
          session_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_sessions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_embeddings: {
        Row: {
          chunk_index: number
          content_id: string
          embedding: string
          text_chunk: string
          updated_at: string
        }
        Insert: {
          chunk_index: number
          content_id: string
          embedding: string
          text_chunk: string
          updated_at?: string
        }
        Update: {
          chunk_index?: number
          content_id?: string
          embedding?: string
          text_chunk?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_embeddings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          body_text: string | null
          id: string
          slug: string
          summary: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          body_text?: string | null
          id?: string
          slug: string
          summary?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          body_text?: string | null
          id?: string
          slug?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          conversion_type: string
          conversion_value: number | null
          created_at: string
          currency: string | null
          id: string
          page_url: string | null
          product_id: string | null
          referrer: string | null
          revenue: number | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          conversion_type: string
          conversion_value?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          revenue?: number | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          conversion_type?: string
          conversion_value?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          revenue?: number | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      goal_events: {
        Row: {
          created_at: string
          goal_name: string
          goal_type: string
          goal_value: number | null
          id: string
          metadata: Json | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          goal_name: string
          goal_type: string
          goal_value?: number | null
          id?: string
          metadata?: Json | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          goal_name?: string
          goal_type?: string
          goal_value?: number | null
          id?: string
          metadata?: Json | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      help_topics: {
        Row: {
          audience: string[]
          key: string
          links: Json[]
          steps: string[]
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string[]
          key: string
          links?: Json[]
          steps: string[]
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string[]
          key?: string
          links?: Json[]
          steps?: string[]
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      manuscripts: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          facebook_group_member: boolean | null
          id: string
          name: string | null
          subscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          facebook_group_member?: boolean | null
          id?: string
          name?: string | null
          subscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          facebook_group_member?: boolean | null
          id?: string
          name?: string | null
          subscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          connection_type: string | null
          created_at: string
          device_type: string | null
          id: string
          metric_type: string
          metric_value: number
          page_url: string
          user_agent: string | null
        }
        Insert: {
          connection_type?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          metric_type: string
          metric_value: number
          page_url: string
          user_agent?: string | null
        }
        Update: {
          connection_type?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          page_url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      product_clicks: {
        Row: {
          clicked_at: string
          conversion_flag: boolean | null
          created_at: string
          id: string
          product_id: string
          product_name: string
          recipe_title: string | null
          referrer_slug: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string
          conversion_flag?: boolean | null
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          recipe_title?: string | null
          referrer_slug?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string
          conversion_flag?: boolean | null
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          recipe_title?: string | null
          referrer_slug?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          body: string
          clicked_at: string | null
          data: Json | null
          delivered_at: string | null
          id: string
          sent_at: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          body: string
          clicked_at?: string | null
          data?: Json | null
          delivered_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string
          clicked_at?: string | null
          data?: Json | null
          delivered_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      qa_feedback: {
        Row: {
          body: string | null
          created_at: string
          created_by: string
          id: string
          metadata: Json
          severity: string
          status: string
          target_id: string | null
          target_type: string
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          created_by: string
          id?: string
          metadata?: Json
          severity?: string
          status?: string
          target_id?: string | null
          target_type: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json
          severity?: string
          status?: string
          target_id?: string | null
          target_type?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipe_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          interaction_type: string | null
          metadata: Json | null
          recipe_id: string
          recommendation_type: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          interaction_type?: string | null
          metadata?: Json | null
          recipe_id: string
          recommendation_type: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          interaction_type?: string | null
          metadata?: Json | null
          recipe_id?: string
          recommendation_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_recommendations_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          photo_url: string | null
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          photo_url?: string | null
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          photo_url?: string | null
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_reviews_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_versions: {
        Row: {
          created_at: string
          created_by: string
          data: Json
          folder: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          recipe_id: string
          slug: string | null
          tags: string[] | null
          title: string
          version_notes: string | null
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by: string
          data: Json
          folder?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          recipe_id: string
          slug?: string | null
          tags?: string[] | null
          title: string
          version_notes?: string | null
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string
          data?: Json
          folder?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          recipe_id?: string
          slug?: string | null
          tags?: string[] | null
          title?: string
          version_notes?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_versions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string
          data: Json
          folder: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          folder?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          folder?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          clicked_result_id: string | null
          clicked_result_type: string | null
          created_at: string
          filters_applied: Json | null
          id: string
          results_count: number | null
          search_context: string | null
          search_query: string
          search_type: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_result_id?: string | null
          clicked_result_type?: string | null
          created_at?: string
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_context?: string | null
          search_query: string
          search_type?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_result_id?: string | null
          clicked_result_type?: string | null
          created_at?: string
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_context?: string | null
          search_query?: string
          search_type?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          priority: string
          status: string
          submission_data: Json
          submission_type: string
          submitter_email: string
          submitter_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          submission_data: Json
          submission_type?: string
          submitter_email: string
          submitter_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          submission_data?: Json
          submission_type?: string
          submitter_email?: string
          submitter_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          target_id: string | null
          target_type: string
          user_id: string
          visibility: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          target_id?: string | null
          target_type: string
          user_id: string
          visibility?: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          target_id?: string | null
          target_type?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          comment: string | null
          created_at: string
          feedback_type: string
          id: string
          metadata: Json | null
          page_url: string | null
          rating: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          feedback_type: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          feedback_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_mfa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_active: boolean
          is_verified: boolean
          method: string
          phone_number: string | null
          secret: string | null
          secret_encrypted: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          method: string
          phone_number?: string | null
          secret?: string | null
          secret_encrypted?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          method?: string
          phone_number?: string | null
          secret?: string | null
          secret_encrypted?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          allergens: string[] | null
          cooking_goals: string[] | null
          created_at: string
          dietary_restrictions: string[] | null
          id: string
          notification_preferences: Json | null
          onboarding_completed: boolean
          personalization_data: Json | null
          preferred_units: string | null
          skill_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergens?: string[] | null
          cooking_goals?: string[] | null
          created_at?: string
          dietary_restrictions?: string[] | null
          id?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean
          personalization_data?: Json | null
          preferred_units?: string | null
          skill_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergens?: string[] | null
          cooking_goals?: string[] | null
          created_at?: string
          dietary_restrictions?: string[] | null
          id?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean
          personalization_data?: Json | null
          preferred_units?: string | null
          skill_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_viewing_history: {
        Row: {
          content_id: string
          content_title: string
          content_type: string
          content_url: string | null
          id: string
          user_id: string
          view_duration: number | null
          viewed_at: string
        }
        Insert: {
          content_id: string
          content_title: string
          content_type: string
          content_url?: string | null
          id?: string
          user_id: string
          view_duration?: number | null
          viewed_at?: string
        }
        Update: {
          content_id?: string
          content_title?: string
          content_type?: string
          content_url?: string | null
          id?: string
          user_id?: string
          view_duration?: number | null
          viewed_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_security_hardening: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      assign_ab_variant: {
        Args: {
          experiment_name: string
          session_identifier?: string
          user_identifier?: string
        }
        Returns: string
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      create_secure_submission: {
        Args: {
          p_priority?: string
          p_submission_data: Json
          p_submission_type?: string
          p_submitter_email: string
          p_submitter_name: string
        }
        Returns: Json
      }
      decrypt_mfa_secret: {
        Args: { encrypted_secret: string }
        Returns: string
      }
      encrypt_mfa_secret: {
        Args: { secret_text: string }
        Returns: string
      }
      generate_recipe_slug: {
        Args: { recipe_title: string; recipe_user_id: string }
        Returns: string
      }
      get_admin_submissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          notes: string
          priority: string
          status: string
          submission_data: Json
          submission_type: string
          submitter_email: string
          submitter_name: string
          updated_at: string
          user_id: string
        }[]
      }
      get_auth_security_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_core_web_vitals_summary: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_value: number
          metric_type: string
          p75_value: number
          p90_value: number
          sample_count: number
        }[]
      }
      get_decrypted_mfa_secret: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_related_recipes: {
        Args: { limit_count?: number; recipe_id: string }
        Returns: {
          id: string
          image_url: string
          similarity_score: number
          slug: string
          tags: string[]
          title: string
        }[]
      }
      get_trending_recipes: {
        Args: { days_back?: number; limit_count?: number }
        Returns: {
          activity_score: number
          created_at: string
          id: string
          image_url: string
          slug: string
          tags: string[]
          title: string
          user_id: string
        }[]
      }
      get_user_mfa_secret: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_mfa_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          has_backup_codes: boolean
          has_phone_number: boolean
          id: string
          is_active: boolean
          is_verified: boolean
          method: string
          updated_at: string
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_content: {
        Args: {
          filter_type: string
          match_count: number
          query_embedding: string
        }
        Returns: {
          chunk_index: number
          content_id: string
          score: number
          text_chunk: string
        }[]
      }
      search_blog_posts: {
        Args:
          | { limit_count?: number; search_query: string }
          | {
              limit_count?: number
              search_query: string
              tag_filters?: string[]
            }
        Returns: {
          excerpt: string
          hero_image_url: string
          id: string
          search_rank: number
          slug: string
          tags: string[]
          title: string
        }[]
      }
      search_recipes: {
        Args:
          | {
              dietary_filters?: string[]
              difficulty_filter?: string
              ingredients_filter?: string[]
              limit_count?: number
              prep_time_max?: number
              search_query: string
              total_time_max?: number
            }
          | { limit_count?: number; search_query: string }
        Returns: {
          excerpt: string
          id: string
          image_url: string
          search_rank: number
          slug: string
          tags: string[]
          title: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      store_encrypted_mfa_secret: {
        Args: {
          p_backup_codes?: string[]
          p_method: string
          p_phone_number?: string
          p_secret: string
          p_user_id: string
        }
        Returns: string
      }
      subscribe_to_newsletter: {
        Args: { p_email: string; p_name?: string }
        Returns: Json
      }
      unsubscribe_from_newsletter: {
        Args: { p_email: string }
        Returns: Json
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      verify_backup_code: {
        Args: { p_backup_code: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "qa_reviewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "qa_reviewer"],
    },
  },
} as const
