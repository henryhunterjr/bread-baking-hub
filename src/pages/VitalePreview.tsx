import React from 'react';
import { useNavigate } from 'react-router-dom';

interface VitalePreviewPageProps {}

const VitalePreviewPage: React.FC<VitalePreviewPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 text-primary hover:text-primary/80 font-medium"
          >
            ← Back
          </button>
          
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Vitale Sourdough Mastery</h1>
              <p className="text-xl text-muted-foreground">Preview Chapter</p>
            </div>

            <div className="bg-card rounded-lg p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Chapter 1: Understanding Vitale</h2>
                
                <div className="prose max-w-none space-y-4">
                  <p className="text-lg leading-relaxed">
                    After ten years with my starter—Vitale—I've learned that sourdough isn't about following rigid rules. It's about understanding a living culture and responding to what it tells you.
                  </p>
                  
                  <p>
                    Vitale has traveled with me from state to state, adapted to different kitchens, and taught me that consistency comes not from controlling every variable, but from learning to read the signs a healthy starter provides.
                  </p>
                  
                  <p>
                    <strong>Visual Cues That Matter</strong><br />
                    Vitale's surface tells me everything: bubbles and slight doming mean active fermentation—perfect for milder loaves. If she's fallen with liquid on top, she's past peak but ready for tangier, complex flavors.
                  </p>
                  
                  <p>
                    The texture changes throughout the fermentation cycle. Fresh from feeding, Vitale feels smooth and slightly elastic. As she develops, tiny bubbles create a lighter, almost mousse-like consistency. Understanding these phases means never guessing when your starter is ready.
                  </p>
                  
                  <p className="text-muted-foreground italic">
                    [Preview continues with purchasing full book...]
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">Want to read the complete guide?</p>
                  <div className="flex gap-4 justify-center">
                    <a 
                      href="https://www.amazon.com/dp/B0CVB8ZCFV" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors"
                    >
                      Buy on Amazon
                    </a>
                    <a 
                      href="https://read.amazon.com/sample/B0CVB8ZCFV?clientId=share" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-md transition-colors"
                    >
                      Read Full Sample
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalePreviewPage;