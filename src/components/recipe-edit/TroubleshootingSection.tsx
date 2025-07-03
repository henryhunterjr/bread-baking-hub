import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TroubleshootingItem {
  issue: string;
  solution: string;
}

interface TroubleshootingSectionProps {
  troubleshooting: TroubleshootingItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, item: TroubleshootingItem) => void;
}

export const TroubleshootingSection = ({ 
  troubleshooting, 
  isOpen, 
  onToggle, 
  onAdd, 
  onRemove, 
  onUpdate 
}: TroubleshootingSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Troubleshooting</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-2">
        {troubleshooting.map((item, index) => (
          <div key={index} className="border rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Issue & Solution {index + 1}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={troubleshooting.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={item.issue || ''}
              onChange={(e) => onUpdate(index, { ...item, issue: e.target.value })}
              placeholder="What's the issue?"
            />
            <Textarea
              value={item.solution || ''}
              onChange={(e) => onUpdate(index, { ...item, solution: e.target.value })}
              placeholder="How to solve it..."
              rows={2}
            />
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
          Add Troubleshooting
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};