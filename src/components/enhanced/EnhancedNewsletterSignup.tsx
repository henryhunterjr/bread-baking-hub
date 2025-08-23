import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedNewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  title?: string;
  description?: string;
}

const EnhancedNewsletterSignup = ({ 
  className = '', 
  variant = 'default',
  title,
  description 
}: EnhancedNewsletterSignupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facebookGroupMember: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert subscriber data
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: formData.email.toLowerCase().trim(),
          name: formData.name.trim(),
          facebook_group_member: formData.facebookGroupMember,
          active: true
        });

      if (insertError) {
        if (insertError.code === '23505') { // Duplicate email
          toast.error('This email is already subscribed to our newsletter');
          return;
        }
        throw insertError;
      }

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: formData.email,
          name: formData.name,
          facebookGroupMember: formData.facebookGroupMember
        }
      });

      if (emailError) {
        console.warn('Welcome email failed to send:', emailError);
        // Don't fail the subscription if email fails
      }

      setIsSubscribed(true);
      setFormData({ name: '', email: '', facebookGroupMember: false });
      toast.success('Successfully subscribed! Check your email for a welcome message.');
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTitle = variant === 'compact' ? 'Stay Updated' : 'Join Our Baking Community';
  const defaultDescription = variant === 'compact' 
    ? 'Get weekly baking tips and recipes.'
    : 'Get the latest baking tips, recipes, and troubleshooting guides delivered to your inbox.';

  if (isSubscribed) {
    return (
      <Card className={`bg-gradient-subtle border-primary/20 ${className}`}>
        <CardContent className={variant === 'compact' ? 'p-4 text-center' : 'p-8 text-center'}>
          <CheckCircle className={`${variant === 'compact' ? 'h-8 w-8' : 'h-12 w-12'} text-primary mx-auto mb-4`} />
          <h3 className={`${variant === 'compact' ? 'text-lg' : 'text-xl'} font-bold text-primary mb-2`}>
            Welcome to our community!
          </h3>
          <p className="text-muted-foreground">
            Thank you for subscribing. You'll receive our latest baking tips and recipes.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={isSubmitting}
            aria-label="Your name"
            required
          />
          <Input
            type="email"
            placeholder="Your email address"
            value={formData.email}
            aria-label="Your email address"
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="facebook-member-inline"
            checked={formData.facebookGroupMember}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, facebookGroupMember: !!checked }))
            }
          />
          <label htmlFor="facebook-member-inline" className="text-sm text-muted-foreground cursor-pointer">
            I'm a member of the "Baking Great Bread at Home" Facebook group
          </label>
        </div>

        <Button 
          type="submit" 
          variant="warm"
          disabled={isSubmitting || !formData.email || !formData.name}
          className="w-full"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    );
  }

  return (
    <Card className={`bg-gradient-subtle border-primary/20 ${className}`}>
      <CardContent className={variant === 'compact' ? 'p-6' : 'p-8'}>
        <div className="text-center mb-6">
          <Mail className={`${variant === 'compact' ? 'h-8 w-8' : 'h-12 w-12'} text-primary mx-auto mb-4`} />
          <h3 className={`${variant === 'compact' ? 'text-xl' : 'text-2xl'} font-bold text-primary mb-2`}>
            {title || defaultTitle}
          </h3>
          <p className="text-muted-foreground">
            {description || defaultDescription}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={isSubmitting}
            aria-label="Your name"
            required
          />
          
          <Input
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={isSubmitting}
            aria-label="Your email address"
            required
          />
          
          <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="facebook-member"
              checked={formData.facebookGroupMember}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, facebookGroupMember: !!checked }))
              }
            />
            <div className="flex-1">
              <label htmlFor="facebook-member" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                I'm a member of "Baking Great Bread at Home" Facebook group
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Get exclusive content tailored for our Facebook community members
              </p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="warm"
            disabled={isSubmitting || !formData.email || !formData.name}
            className="w-full"
          >
            {isSubmitting ? 'Subscribing...' : 'Join Our Community'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedNewsletterSignup;