import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, BookOpen, Video } from 'lucide-react';

const EmptyState: React.FC = () => {
  const handleProofingGuide = () => {
    // Navigate to proofing guide
    window.open('/glossary#proofing', '_blank');
  };

  const handleScoringVideo = () => {
    // Navigate to scoring techniques video
    window.open('https://youtube.com/watch?v=scoring-techniques', '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8">
          <div className="mb-6">
            <PartyPopper className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              🎉 No issues detected!
            </h2>
            <p className="text-muted-foreground">
              Your bread analysis looks great! Everything appears to be on track.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground mb-4">
              For preventative tips:
            </p>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleProofingGuide}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Proofing Guide
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleScoringVideo}
              >
                <Video className="w-4 h-4 mr-2" />
                Scoring Techniques Video
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Keep up the excellent baking! 🍞
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;