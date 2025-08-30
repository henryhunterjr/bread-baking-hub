import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Send, MessageCircle, Bug, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserFeedbackProps {
  className?: string;
  triggerText?: string;
  showInline?: boolean;
  pageContext?: string;
}

export const UserFeedback: React.FC<UserFeedbackProps> = ({
  className = "",
  triggerText = "Give Feedback",
  showInline = false,
  pageContext
}) => {
  const [isOpen, setIsOpen] = useState(showInline);
  const [feedbackType, setFeedbackType] = useState<'rating' | 'comment' | 'bug_report' | 'feature_request'>('rating');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (feedbackType === 'rating' && rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    if ((feedbackType === 'comment' || feedbackType === 'bug_report' || feedbackType === 'feature_request') && !comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user?.id,
          feedback_type: feedbackType,
          rating: feedbackType === 'rating' ? rating : null,
          comment: comment.trim() || null,
          page_url: pageContext || window.location.href,
          metadata: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page_title: document.title
          }
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      });

      // Reset form
      setRating(0);
      setComment('');
      setFeedbackType('rating');
      if (!showInline) {
        setIsOpen(false);
      }

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FeedbackForm = () => (
    <div ref={formRef} className="space-y-4">
      <div>
        <Label htmlFor="feedback-type">Feedback Type</Label>
        <Select value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Rate your experience
              </div>
            </SelectItem>
            <SelectItem value="comment">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                General feedback
              </div>
            </SelectItem>
            <SelectItem value="bug_report">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Report a bug
              </div>
            </SelectItem>
            <SelectItem value="feature_request">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggest a feature
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {feedbackType === 'rating' && (
        <div>
          <Label>How would you rate your experience?</Label>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating 
                    ? 'text-yellow-400 hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}
                type="button"
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <Star className={`h-8 w-8 ${star <= rating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
              {rating === 2 && "We appreciate your feedback. What could we do better?"}
              {rating === 3 && "Thank you for your feedback. Any suggestions for improvement?"}
              {rating === 4 && "Great! We're glad you had a good experience."}
              {rating === 5 && "Excellent! We're thrilled you love using our site."}
            </p>
          )}
        </div>
      )}

      {(feedbackType !== 'rating' || rating > 0) && (
        <div>
          <Label htmlFor="comment">
            {feedbackType === 'rating' && 'Additional comments (optional)'}
            {feedbackType === 'comment' && 'Your feedback'}
            {feedbackType === 'bug_report' && 'Describe the bug'}
            {feedbackType === 'feature_request' && 'Describe your feature idea'}
          </Label>
          <Textarea
            id="comment"
            placeholder={
              feedbackType === 'rating' ? 'Tell us more about your experience...' :
              feedbackType === 'comment' ? 'Share your thoughts...' :
              feedbackType === 'bug_report' ? 'What happened? What did you expect to happen?' :
              'What feature would you like to see?'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {!showInline && (
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );

  if (showInline) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Share Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 z-40 ${className}`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {triggerText}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Share Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackForm />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserFeedback;