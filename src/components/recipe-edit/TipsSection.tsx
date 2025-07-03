import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TipsSectionProps {
  tips: string[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export const TipsSection = ({ 
  tips, 
  isOpen, 
  onToggle, 
  onAdd, 
  onRemove, 
  onUpdate 
}: TipsSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Tips</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={tip}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder="Pro tip..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
              disabled={tips.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tip
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};