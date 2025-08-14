export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      get_user_mfa_secret: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
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
