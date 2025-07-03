import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X, Folder, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrganizationSectionProps {
  folder: string;
  tags: string[];
  allRecipes: any[];
  isOpen: boolean;
  onToggle: () => void;
  onUpdateFolder: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  onUpdateTag: (index: number, value: string) => void;
  onQuickAddTag: (tag: string) => void;
}

export const OrganizationSection = ({ 
  folder,
  tags,
  allRecipes,
  isOpen, 
  onToggle,
  onUpdateFolder,
  onAddTag,
  onRemoveTag,
  onUpdateTag,
  onQuickAddTag
}: OrganizationSectionProps) => {
  const existingFolders = [...new Set(allRecipes.map(r => r.folder).filter(Boolean))];
  const existingTags = [...new Set(allRecipes.flatMap(r => r.tags || []))].filter(Boolean);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded">
        <h4 className="font-semibold flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Organization
        </h4>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-2">
        <div>
          <Label htmlFor="folder">Folder</Label>
          <Select value={folder} onValueChange={onUpdateFolder}>
            <SelectTrigger>
              <SelectValue placeholder="Select or create folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Folder</SelectItem>
              {existingFolders.map((existingFolder) => (
                <SelectItem key={existingFolder} value={existingFolder}>{existingFolder}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="mt-2"
            value={folder}
            onChange={(e) => onUpdateFolder(e.target.value)}
            placeholder="Or type new folder name"
          />
        </div>
        <div>
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </Label>
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={tag}
                  onChange={(e) => onUpdateTag(index, e.target.value)}
                  placeholder="Tag name"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveTag(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddTag}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>
          <div className="mt-2">
            <Label className="text-sm text-muted-foreground">Existing tags:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {existingTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => onQuickAddTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};