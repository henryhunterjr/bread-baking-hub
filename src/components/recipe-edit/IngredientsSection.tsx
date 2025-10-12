import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngredientsSectionProps {
  ingredients: string[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export const IngredientsSection = ({ 
  ingredients, 
  isOpen, 
  onToggle, 
  onAdd, 
  onRemove, 
  onUpdate 
}: IngredientsSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Ingredients</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {ingredients.map((ingredient, index) => {
          // Check if this is a header (starts with ###)
          const isHeader = ingredient.trim().startsWith('###') || ingredient.trim().startsWith('####');
          
          return (
            <div key={index} className={`flex gap-2 ${isHeader ? 'mt-4' : ''}`}>
              <Input
                value={ingredient}
                onChange={(e) => onUpdate(index, e.target.value)}
                placeholder={isHeader ? "### Section Header" : "1 cup flour"}
                className={`flex-1 ${isHeader ? 'font-bold' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={ingredients.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};