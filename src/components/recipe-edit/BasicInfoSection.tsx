import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BasicInfoSectionProps {
  formData: {
    introduction: string;
    prep_time: string;
    cook_time: string;
    total_time: string;
    servings: string;
  };
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: string) => void;
}

export const BasicInfoSection = ({ formData, isOpen, onToggle, onUpdate }: BasicInfoSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Basic Information</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-2">
        <div>
          <Label htmlFor="introduction">Introduction</Label>
          <Textarea
            id="introduction"
            value={formData.introduction}
            onChange={(e) => onUpdate('introduction', e.target.value)}
            placeholder="Recipe introduction..."
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="prep_time">Prep Time</Label>
            <Input
              id="prep_time"
              value={formData.prep_time}
              onChange={(e) => onUpdate('prep_time', e.target.value)}
              placeholder="15 mins"
            />
          </div>
          <div>
            <Label htmlFor="cook_time">Cook Time</Label>
            <Input
              id="cook_time"
              value={formData.cook_time}
              onChange={(e) => onUpdate('cook_time', e.target.value)}
              placeholder="30 mins"
            />
          </div>
          <div>
            <Label htmlFor="total_time">Total Time</Label>
            <Input
              id="total_time"
              value={formData.total_time}
              onChange={(e) => onUpdate('total_time', e.target.value)}
              placeholder="45 mins"
            />
          </div>
          <div>
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              value={formData.servings}
              onChange={(e) => onUpdate('servings', e.target.value)}
              placeholder="4-6"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};