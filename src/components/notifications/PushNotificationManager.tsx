import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NotificationPreferences {
  newRecipes: boolean;
  recipeUpdates: boolean;
  communityActivity: boolean;
  achievements: boolean;
  recommendations: boolean;
}

const PushNotificationManager = () => {
  const { user } = useAuth();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newRecipes: true,
    recipeUpdates: true,
    communityActivity: false,
    achievements: true,
    recommendations: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
    loadPreferences();
  }, [user]);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true);
      setPermission(Notification.permission);
      
      // Check for existing subscription
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setSubscription(sub);
        });
      });
    }
  };

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('notification_preferences')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.notification_preferences) {
        const prefs = data.notification_preferences as any;
        setPreferences({
          newRecipes: prefs.newRecipes ?? true,
          recipeUpdates: prefs.recipeUpdates ?? true,
          communityActivity: prefs.communityActivity ?? false,
          achievements: prefs.achievements ?? true,
          recommendations: prefs.recommendations ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const requestPermission = async () => {
    if (!supported) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await subscribeToPush();
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive push notifications',
        });
      } else {
        toast({
          title: 'Permission Denied',
          description: 'Please enable notifications in your browser settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // In a real app, you'd get this from your server
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      setSubscription(subscription);

      // Save subscription to backend
      const { error } = await supabase.functions.invoke('save-push-subscription', {
        body: {
          subscription: subscription.toJSON(),
          userId: user?.id,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    setLoading(true);
    try {
      await subscription.unsubscribe();
      setSubscription(null);

      // Remove subscription from backend
      await supabase.functions.invoke('remove-push-subscription', {
        body: { userId: user?.id },
      });

      toast({
        title: 'Notifications Disabled',
        description: 'You will no longer receive push notifications',
      });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to disable notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          notification_preferences: {
            ...updated,
            email: true, // Keep existing email preference
            push: subscription !== null,
            sms: false,
          },
        })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
    }
  };

  const sendTestNotification = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-test-notification', {
        body: { userId: user?.id },
      });

      if (error) throw error;

      toast({
        title: 'Test Sent',
        description: 'Check for the test notification',
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive',
      });
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Enabled
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <BellOff className="w-3 h-3" />
            Blocked
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Not Set
          </Badge>
        );
    }
  };

  if (!supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Not supported in this browser</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Push notifications require a modern browser with service worker support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
            {getPermissionStatus()}
          </CardTitle>
          <CardDescription>
            Stay updated with new recipes, community activity, and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission !== 'granted' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enable push notifications to receive updates even when the app is closed.
              </p>
              <Button 
                onClick={requestPermission} 
                disabled={loading}
                className="w-full"
              >
                <Bell className="w-4 h-4 mr-2" />
                {loading ? 'Enabling...' : 'Enable Notifications'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Push notifications enabled</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={sendTestNotification}>
                    Test
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={unsubscribeFromPush}
                    disabled={loading}
                  >
                    {loading ? 'Disabling...' : 'Disable'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New Recipes</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified when new recipes are published
                  </div>
                </div>
                <Switch
                  checked={preferences.newRecipes}
                  onCheckedChange={(checked) => 
                    updatePreferences({ newRecipes: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Recipe Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Updates to recipes you've saved or created
                  </div>
                </div>
                <Switch
                  checked={preferences.recipeUpdates}
                  onCheckedChange={(checked) => 
                    updatePreferences({ recipeUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Community Activity</div>
                  <div className="text-sm text-muted-foreground">
                    Comments, reviews, and social interactions
                  </div>
                </div>
                <Switch
                  checked={preferences.communityActivity}
                  onCheckedChange={(checked) => 
                    updatePreferences({ communityActivity: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Achievements</div>
                  <div className="text-sm text-muted-foreground">
                    When you earn new badges and achievements
                  </div>
                </div>
                <Switch
                  checked={preferences.achievements}
                  onCheckedChange={(checked) => 
                    updatePreferences({ achievements: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">AI Recommendations</div>
                  <div className="text-sm text-muted-foreground">
                    Personalized recipe recommendations
                  </div>
                </div>
                <Switch
                  checked={preferences.recommendations}
                  onCheckedChange={(checked) => 
                    updatePreferences({ recommendations: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PushNotificationManager;