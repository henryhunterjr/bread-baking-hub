import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChefHat, Target, Utensils, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const UserOnboarding = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [cookingGoals, setCookingGoals] = useState<string[]>([]);
  const [preferredUnits, setPreferredUnits] = useState<'metric' | 'imperial'>('metric');

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Baking Great Bread!',
      description: 'Let\'s personalize your baking journey',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'skill',
      title: 'What\'s your baking experience?',
      description: 'This helps us recommend appropriate recipes',
      icon: <ChefHat className="w-6 h-6" />
    },
    {
      id: 'dietary',
      title: 'Any dietary preferences?',
      description: 'We\'ll filter recipes to match your needs',
      icon: <Utensils className="w-6 h-6" />
    },
    {
      id: 'goals',
      title: 'What are your baking goals?',
      description: 'Help us curate content that interests you',
      icon: <Target className="w-6 h-6" />
    }
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Low-Carb', 'Keto', 'Paleo', 'Sugar-Free'
  ];

  const allergenOptions = [
    'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Seeds'
  ];

  const goalOptions = [
    'Master Basic Breads', 'Sourdough Expertise', 'Artisan Techniques',
    'Quick Breads', 'International Breads', 'Decorative Breads',
    'Healthy Alternatives', 'Competition Baking'
  ];

  const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      savePreferences();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user.id,
        skill_level: skillLevel,
        dietary_restrictions: dietaryRestrictions,
        allergens,
        cooking_goals: cookingGoals,
        preferred_units: preferredUnits,
        notification_preferences: {
          email: true,
          push: false,
          sms: false
        },
        onboarding_completed: true
      });

      if (error) throw error;

      toast({
        title: 'Welcome aboard!',
        description: 'Your preferences have been saved. Let\'s start baking!',
      });

      // Redirect to dashboard or home
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            {steps[currentStep].icon}
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground text-center">
            Step {currentStep + 1} of {steps.length}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🍞</div>
              <p className="text-lg">
                We're excited to help you become a better baker! Let's get to know you.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">Select your skill level:</h3>
              <div className="grid grid-cols-1 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={skillLevel === level ? 'default' : 'outline'}
                    className="justify-start h-auto p-4"
                    onClick={() => setSkillLevel(level)}
                  >
                    <div className="text-left">
                      <div className="font-medium capitalize">{level}</div>
                      <div className="text-sm text-muted-foreground">
                        {level === 'beginner' && 'New to baking or just starting with bread'}
                        {level === 'intermediate' && 'Comfortable with basic recipes and techniques'}
                        {level === 'advanced' && 'Experienced baker looking for challenges'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Preferred measurement units:</h3>
                <div className="flex gap-3">
                  <Button
                    variant={preferredUnits === 'metric' ? 'default' : 'outline'}
                    onClick={() => setPreferredUnits('metric')}
                  >
                    Metric (grams, °C)
                  </Button>
                  <Button
                    variant={preferredUnits === 'imperial' ? 'default' : 'outline'}
                    onClick={() => setPreferredUnits('imperial')}
                  >
                    Imperial (cups, °F)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Dietary preferences (optional):</h3>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={dietaryRestrictions.includes(option) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSelection(option, dietaryRestrictions, setDietaryRestrictions)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Allergens to avoid (optional):</h3>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={allergens.includes(option) ? 'destructive' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSelection(option, allergens, setAllergens)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium">What would you like to learn? (Select all that apply):</h3>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map((goal) => (
                  <Badge
                    key={goal}
                    variant={cookingGoals.includes(goal) ? 'default' : 'outline'}
                    className="cursor-pointer justify-center p-3 h-auto text-center"
                    onClick={() => toggleSelection(goal, cookingGoals, setCookingGoals)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;