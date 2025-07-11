import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup = ({ className }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Placeholder for newsletter service integration
      // Replace with actual API call to Mailchimp, ConvertKit, etc.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed to our newsletter!');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`bg-gradient-subtle border-primary/20 ${className}`}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Welcome to our community!</h3>
          <p className="text-muted-foreground">
            Thank you for subscribing. You'll receive our latest baking tips and recipes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-subtle border-primary/20 ${className}`}>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-2">Stay Updated</h3>
          <p className="text-muted-foreground">
            Get the latest baking tips, recipes, and troubleshooting guides delivered to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              variant="warm"
              disabled={isSubmitting || !email}
              className="px-6"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;