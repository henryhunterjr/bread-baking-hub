import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserPreferences {
  dietary_restrictions: string[];
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  preferred_units: 'metric' | 'imperial';
  allergens: string[];
  cooking_goals: string[];
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newRecipes?: boolean;
    recipeUpdates?: boolean;
    communityActivity?: boolean;
    achievements?: boolean;
    recommendations?: boolean;
  };
  personalization_data: any;
  onboarding_completed: boolean;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          ...data,
          skill_level: data.skill_level as UserPreferences['skill_level'],
          preferred_units: data.preferred_units as UserPreferences['preferred_units'],
          notification_preferences: data.notification_preferences as UserPreferences['notification_preferences'],
          personalization_data: data.personalization_data as any,
        });
      } else {
        // Create default preferences
        const defaultPreferences: Partial<UserPreferences> = {
          dietary_restrictions: [],
          skill_level: 'beginner',
          preferred_units: 'metric',
          allergens: [],
          cooking_goals: [],
          notification_preferences: {
            email: true,
            push: false,
            sms: false,
          },
          personalization_data: {},
          onboarding_completed: false,
        };

        const { data: newData, error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            ...defaultPreferences,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences({
          ...newData,
          skill_level: newData.skill_level as UserPreferences['skill_level'],
          preferred_units: newData.preferred_units as UserPreferences['preferred_units'],
          notification_preferences: newData.notification_preferences as UserPreferences['notification_preferences'],
          personalization_data: newData.personalization_data as any,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences({
        ...data,
        skill_level: data.skill_level as UserPreferences['skill_level'],
        preferred_units: data.preferred_units as UserPreferences['preferred_units'],
        notification_preferences: data.notification_preferences as UserPreferences['notification_preferences'],
        personalization_data: data.personalization_data as any,
      });
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const completeOnboarding = async (onboardingData: Partial<UserPreferences>) => {
    return updatePreferences({
      ...onboardingData,
      onboarding_completed: true,
    });
  };

  const addCookingGoal = async (goal: string) => {
    if (!preferences) return;

    const updatedGoals = [...preferences.cooking_goals, goal];
    return updatePreferences({ cooking_goals: updatedGoals });
  };

  const removeCookingGoal = async (goal: string) => {
    if (!preferences) return;

    const updatedGoals = preferences.cooking_goals.filter(g => g !== goal);
    return updatePreferences({ cooking_goals: updatedGoals });
  };

  const addDietaryRestriction = async (restriction: string) => {
    if (!preferences) return;

    const updatedRestrictions = [...preferences.dietary_restrictions, restriction];
    return updatePreferences({ dietary_restrictions: updatedRestrictions });
  };

  const removeDietaryRestriction = async (restriction: string) => {
    if (!preferences) return;

    const updatedRestrictions = preferences.dietary_restrictions.filter(r => r !== restriction);
    return updatePreferences({ dietary_restrictions: updatedRestrictions });
  };

  const addAllergen = async (allergen: string) => {
    if (!preferences) return;

    const updatedAllergens = [...preferences.allergens, allergen];
    return updatePreferences({ allergens: updatedAllergens });
  };

  const removeAllergen = async (allergen: string) => {
    if (!preferences) return;

    const updatedAllergens = preferences.allergens.filter(a => a !== allergen);
    return updatePreferences({ allergens: updatedAllergens });
  };

  const updatePersonalizationData = async (data: any) => {
    if (!preferences) return;

    const updatedData = {
      ...preferences.personalization_data,
      ...data,
    };
    return updatePreferences({ personalization_data: updatedData });
  };

  const updateNotificationPreferences = async (notificationPrefs: Partial<UserPreferences['notification_preferences']>) => {
    if (!preferences) return;

    const updatedPrefs = {
      ...preferences.notification_preferences,
      ...notificationPrefs,
    };
    return updatePreferences({ notification_preferences: updatedPrefs });
  };

  const getFilteredRecipes = (recipes: any[]) => {
    if (!preferences) return recipes;

    return recipes.filter(recipe => {
      // Filter by dietary restrictions
      if (preferences.dietary_restrictions.length > 0) {
        const recipeTags = recipe.tags || [];
        const hasRestrictedIngredient = preferences.dietary_restrictions.some(restriction => {
          // This would need more sophisticated ingredient checking
          return !recipeTags.some((tag: string) => 
            tag.toLowerCase().includes(restriction.toLowerCase())
          );
        });
        if (hasRestrictedIngredient) return false;
      }

      // Filter by allergens
      if (preferences.allergens.length > 0) {
        const recipeIngredients = recipe.data?.ingredients || [];
        const hasAllergen = preferences.allergens.some(allergen => {
          return recipeIngredients.some((ingredient: any) =>
            ingredient.name?.toLowerCase().includes(allergen.toLowerCase())
          );
        });
        if (hasAllergen) return false;
      }

      // Filter by skill level (show current level and below)
      if (recipe.difficulty) {
        const skillLevels = ['beginner', 'intermediate', 'advanced'];
        const userLevelIndex = skillLevels.indexOf(preferences.skill_level);
        const recipeLevelIndex = skillLevels.indexOf(recipe.difficulty);
        if (recipeLevelIndex > userLevelIndex) return false;
      }

      return true;
    });
  };

  return {
    preferences,
    loading,
    updatePreferences,
    completeOnboarding,
    addCookingGoal,
    removeCookingGoal,
    addDietaryRestriction,
    removeDietaryRestriction,
    addAllergen,
    removeAllergen,
    updatePersonalizationData,
    updateNotificationPreferences,
    getFilteredRecipes,
  };
};