import { Button } from '@/components/ui/button';
import challengeBreadImage from '@/assets/challenge-bread.jpg';

const MonthlyChallenge = () => {
  return (
    <section className="py-20 px-4 bg-gradient-amber">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              July 2025 Challenge
            </div>
            <h2 className="text-4xl font-bold text-primary-foreground">
              Master Hydration & Timing
            </h2>
            <p className="text-amber-100 text-lg leading-relaxed">
              This month, we're focusing on the two most critical aspects of great bread: 
              proper hydration levels and fermentation timing. Join thousands of bakers 
              as we perfect these foundational skills together.
            </p>
            
            <div className="space-y-4">
              {[
                { week: 1, title: "Understanding Hydration", desc: "Learn how flour type affects water absorption" },
                { week: 2, title: "Perfect Timing", desc: "Master bulk fermentation and proofing schedules" },
                { week: 3, title: "Troubleshooting", desc: "Fix common hydration and timing mistakes" },
                { week: 4, title: "Your Best Loaf", desc: "Apply everything you've learned for perfect results" }
              ].map((item) => (
                <div key={item.week} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">{item.week}</span>
                  </div>
                  <div>
                    <h4 className="text-primary-foreground font-semibold">Week {item.week}: {item.title}</h4>
                    <p className="text-amber-200 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <a href="https://scorebig-jp8784l.gamma.site/" target="_blank" rel="noopener noreferrer">
                  Join This Challenge
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer">
                  Community Group
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={challengeBreadImage} 
              alt="Perfect artisan bread showcasing hydration mastery"
              className="rounded-2xl shadow-stone w-full h-auto"
            />
            <div className="absolute -top-4 -right-4 bg-primary-foreground text-primary p-4 rounded-lg shadow-warm">
              <p className="font-bold text-2xl">2,847</p>
              <p className="text-sm">Bakers Joined</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyChallenge;