import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Share, Eye, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'viewing' | 'editing';
  cursor?: { x: number; y: number };
}

interface RealtimeCollaborationProps {
  recipeId: string;
  isOwner: boolean;
}

const RealtimeCollaboration: React.FC<RealtimeCollaborationProps> = ({ recipeId, isOwner }) => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user || !recipeId) return;

    // Set up real-time collaboration channel
    const collaborationChannel = supabase.channel(`recipe-${recipeId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track presence
    collaborationChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = collaborationChannel.presenceState();
        const participantList: Participant[] = Object.entries(newState).map(([userId, presences]: [string, any]) => {
          const presence = presences[0];
          return {
            id: userId,
            name: presence.name || 'Anonymous',
            status: presence.status || 'viewing',
            cursor: presence.cursor,
          };
        });
        setParticipants(participantList);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .on('broadcast', { event: 'recipe-edit' }, (payload) => {
        console.log('Recipe edit received:', payload);
        // Handle real-time recipe edits
      })
      .on('broadcast', { event: 'cursor-move' }, (payload) => {
        // Handle cursor movements
        setParticipants(prev => 
          prev.map(p => 
            p.id === payload.userId 
              ? { ...p, cursor: payload.cursor }
              : p
          )
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await collaborationChannel.track({
            name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Anonymous',
            status: 'viewing',
            joinedAt: new Date().toISOString(),
          });
          setChannel(collaborationChannel);
        }
      });

    return () => {
      collaborationChannel.unsubscribe();
    };
  }, [user, recipeId]);

  const startCollaboration = async () => {
    if (!isOwner) {
      toast({
        title: 'Permission Denied',
        description: 'Only recipe owners can start collaboration sessions',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase.from('collaboration_sessions').insert({
        recipe_id: recipeId,
        owner_id: user?.id,
        participants: [],
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }).select().single();

      if (error) throw error;

      setSessionId(data.id);
      setIsCollaborating(true);

      // Update presence status
      if (channel) {
        await channel.track({
          name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Anonymous',
          status: 'editing',
          sessionId: data.id,
        });
      }

      toast({
        title: 'Collaboration Started',
        description: 'Others can now join and edit this recipe with you',
      });
    } catch (error) {
      console.error('Error starting collaboration:', error);
      toast({
        title: 'Error',
        description: 'Failed to start collaboration session',
        variant: 'destructive',
      });
    }
  };

  const endCollaboration = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('collaboration_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;

      setIsCollaborating(false);
      setSessionId(null);

      // Update presence status
      if (channel) {
        await channel.track({
          name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Anonymous',
          status: 'viewing',
        });
      }

      toast({
        title: 'Collaboration Ended',
        description: 'The recipe is now in read-only mode',
      });
    } catch (error) {
      console.error('Error ending collaboration:', error);
      toast({
        title: 'Error',
        description: 'Failed to end collaboration session',
        variant: 'destructive',
      });
    }
  };

  const shareCollaboration = async () => {
    const shareUrl = `${window.location.origin}/recipe/${recipeId}?collaborate=true`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Share this link to invite others to collaborate',
      });
    } catch (error) {
      toast({
        title: 'Share Link',
        description: shareUrl,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'editing':
        return <Edit className="w-3 h-3" />;
      case 'viewing':
        return <Eye className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'editing':
        return 'bg-green-500';
      case 'viewing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Live Collaboration
          {participants.length > 0 && (
            <Badge variant="secondary">
              {participants.length} {participants.length === 1 ? 'person' : 'people'} online
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Work together on this recipe in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Participants */}
        {participants.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Online Now:</h4>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="relative">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(participant.status)}`} />
                  </div>
                  <span className="text-sm font-medium">{participant.name}</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(participant.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {isOwner && (
            <>
              {!isCollaborating ? (
                <Button onClick={startCollaboration} className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Start Collaboration
                </Button>
              ) : (
                <Button onClick={endCollaboration} variant="destructive" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  End Collaboration
                </Button>
              )}
            </>
          )}
          
          {isCollaborating && (
            <Button onClick={shareCollaboration} variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          )}
        </div>

        {!isOwner && !isCollaborating && (
          <div className="text-sm text-muted-foreground text-center p-4 bg-muted rounded-lg">
            This recipe is in view-only mode. Ask the owner to start a collaboration session to edit together.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeCollaboration;