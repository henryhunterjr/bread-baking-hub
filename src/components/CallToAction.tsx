import { Button } from '@/components/ui/button';
import EnhancedNewsletterSignup from './enhanced/EnhancedNewsletterSignup';

const CallToAction = () => {
  return (
    <section className="py-20 px-4 bg-gradient-subtle">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Ready to Start Your Bread Journey?
        </h2>
        <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of passionate bakers in our supportive community. Get expert guidance, 
          share your progress, and master the art of bread baking together.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-card p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-primary mb-4">Join Our Facebook Community</h3>
            <p className="text-muted-foreground mb-6">
              Connect with 15,000+ bakers, get expert answers, and share your bread journey 
              in our welcoming, inclusive community.
            </p>
            <Button variant="default" size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="https://www.facebook.com/groups/1082865755403754" target="_blank" rel="noopener noreferrer">
                Join Facebook Group
              </a>
            </Button>
          </div>
          
          <div className="bg-card p-8 rounded-xl">
            <EnhancedNewsletterSignup 
              variant="compact"
              title="Get Weekly Tips"
              description="Receive actionable bread baking tips, new recipes, and exclusive content delivered to your inbox every week."
            />
          </div>
        </div>
        
        <div className="pt-8 border-t border-stone-600">
          <p className="text-muted-foreground">
            Questions? Email me directly at{' '}
            <a href="mailto:henrysbreadkitchen@gmail.com" className="text-primary hover:text-primary/80 transition-colors">
              henrysbreadkitchen@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;