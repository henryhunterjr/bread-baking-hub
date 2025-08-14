-- Enhanced authentication features
CREATE TABLE public.user_mfa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('totp', 'sms', 'backup_codes')),
  secret TEXT,
  backup_codes TEXT[],
  phone_number TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences and settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  dietary_restrictions TEXT[] DEFAULT '{}',
  skill_level TEXT DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_units TEXT DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
  allergens TEXT[] DEFAULT '{}',
  cooking_goals TEXT[] DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{"email": true, "push": false, "sms": false}',
  personalization_data JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time collaboration
CREATE TABLE public.collaboration_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participants JSONB DEFAULT '[]',
  session_data JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI recommendations tracking
CREATE TABLE public.recipe_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('ai_based', 'similar_users', 'trending', 'seasonal')),
  confidence_score FLOAT DEFAULT 0.5,
  interaction_type TEXT CHECK (interaction_type IN ('viewed', 'saved', 'cooked', 'shared', 'dismissed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User activity feed
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('recipe_created', 'recipe_shared', 'recipe_cooked', 'review_posted', 'achievement_earned')),
  target_type TEXT NOT NULL CHECK (target_type IN ('recipe', 'review', 'achievement', 'user')),
  target_id UUID,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  activity_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Push notification tracking
CREATE TABLE public.push_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'clicked', 'failed'))
);

-- Enable RLS
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own MFA settings" ON public.user_mfa
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view active collaboration sessions they participate in" ON public.collaboration_sessions
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    auth.uid()::text = ANY(SELECT jsonb_array_elements_text(participants))
  );

CREATE POLICY "Users can create collaboration sessions for their recipes" ON public.collaboration_sessions
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Session owners can update their sessions" ON public.collaboration_sessions
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view their recommendations" ON public.recipe_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert recommendations" ON public.recipe_recommendations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their recommendation interactions" ON public.recipe_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public activities and their own" ON public.user_activities
  FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON public.push_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can send notifications" ON public.push_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notification status" ON public.push_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_mfa_user_id ON public.user_mfa(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_collaboration_sessions_recipe_id ON public.collaboration_sessions(recipe_id);
CREATE INDEX idx_collaboration_sessions_owner_id ON public.collaboration_sessions(owner_id);
CREATE INDEX idx_recipe_recommendations_user_id ON public.recipe_recommendations(user_id);
CREATE INDEX idx_recipe_recommendations_recipe_id ON public.recipe_recommendations(recipe_id);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);
CREATE INDEX idx_push_notifications_user_id ON public.push_notifications(user_id);
CREATE INDEX idx_push_notifications_status ON public.push_notifications(status);

-- Triggers for updated_at
CREATE TRIGGER update_user_mfa_updated_at
  BEFORE UPDATE ON public.user_mfa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaboration_sessions_updated_at
  BEFORE UPDATE ON public.collaboration_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();