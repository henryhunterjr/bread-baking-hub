import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, ExternalLink } from 'lucide-react';
import { trackCommunityShare, trackCommunityDiscussion } from '@/utils/appEvents';

interface CommunityBridgeProps {
  symptomId: string;
}

const CommunityBridge: React.FC<CommunityBridgeProps> = ({ symptomId }) => {
  const handleJoinDiscussion = () => {
    trackCommunityDiscussion(symptomId);
    // Navigate to community discussion for this symptom
    window.open(`https://community.example.com/symptoms/${symptomId}`, '_blank');
  };

  const handleShareExperience = () => {
    trackCommunityShare(symptomId);
    // Open share experience modal/form
    window.open(`https://community.example.com/share/${symptomId}`, '_blank');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Community Help</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Connect with other bakers who've faced similar challenges
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="text-xs">
            {symptomId.replace(/-/g, ' ')}
          </Badge>
          <span className="text-muted-foreground">discussion</span>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleJoinDiscussion}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Join Discussion
            <ExternalLink className="w-3 h-3 ml-auto" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleShareExperience}
          >
            <Users className="w-4 h-4 mr-2" />
            Share Your Experience
          </Button>
        </div>
        
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            💡 Get personalized advice from experienced bakers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityBridge;