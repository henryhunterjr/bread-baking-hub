import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSectionProps {
  imageUrl: string;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (value: string) => void;
}

export const ImageSection = ({ imageUrl, isOpen, onToggle, onUpdate }: ImageSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold">Recipe Image</h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            value={imageUrl}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="https://example.com/recipe-image.jpg"
          />
        </div>
        {imageUrl && (
          <div className="mt-2">
            <img 
              src={imageUrl} 
              alt="Recipe preview" 
              className="w-32 h-32 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};