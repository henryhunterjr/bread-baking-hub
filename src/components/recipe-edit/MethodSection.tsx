import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MethodSectionProps {
  method: string[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export const MethodSection = ({ 
  method, 
  isOpen, 
  onToggle, 
  onAdd, 
  onRemove, 
  onUpdate 
}: MethodSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Method</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {method.map((step, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Step {index + 1}</Label>
              <Textarea
                value={step}
                onChange={(e) => onUpdate(index, e.target.value)}
                placeholder="Describe this step..."
                rows={2}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
              disabled={method.length === 1}
              className="mt-6"
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
          Add Step
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};