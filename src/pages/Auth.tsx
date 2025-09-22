import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in - check for admin status
  useEffect(() => {
    const redirectUser = async () => {
      if (user && !loading) {
        console.log('User detected, checking admin status...');
        
        try {
          // Check where the user was trying to go
          const redirectPath = localStorage.getItem('redirectAfterAuth');
          
          if (redirectPath) {
            console.log('Redirecting to stored path:', redirectPath);
            localStorage.removeItem('redirectAfterAuth');
            window.location.href = redirectPath;
            return;
          }
          
          // Check if user is admin
          const { data: isAdmin, error } = await supabase.rpc('is_current_user_admin');
          
          if (error) {
            console.error('Error checking admin status:', error);
            // Default to recipe library if can't check admin status
            window.location.href = '/my-recipe-library';
          } else if (isAdmin) {
            console.log('Admin user detected, redirecting to dashboard');
            window.location.href = '/dashboard';
          } else {
            console.log('Regular user detected, redirecting to recipe library');
            window.location.href = '/my-recipe-library';
          }
        } catch (error) {
          console.error('Error during redirect:', error);
          window.location.href = '/my-recipe-library';
        }
      }
    };

    redirectUser();
  }, [user, loading]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Form submitted for sign in');
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        console.log('Sign in successful');
        toast({
          title: "Success!",
          description: "Redirecting...",
        });
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-primary">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to access your recipe collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-primary">Create Account</CardTitle>
                  <CardDescription>
                    Join us to save and organize your recipes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Display Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;