import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X, Folder, Tag } from 'lucide-react';

interface RecipeFiltersProps {
  recipes: any[];
  onFilter: (filters: {
    searchTerm: string;
    folder: string;
    selectedTags: string[];
  }) => void;
}

export const RecipeFilters = ({ recipes = [], onFilter }: RecipeFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique folders and tags with null safety
  const folders = [...new Set((recipes || []).map(r => r?.folder).filter(Boolean))];
  const allTags = [...new Set((recipes || []).flatMap(r => r?.tags || []))].filter(Boolean);

  const handleFilterChange = () => {
    onFilter({
      searchTerm,
      folder: selectedFolder,
      selectedTags
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    
    // Auto-apply filter when tags change
    onFilter({
      searchTerm,
      folder: selectedFolder,
      selectedTags: newTags
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFolder('');
    setSelectedTags([]);
    onFilter({
      searchTerm: '',
      folder: '',
      selectedTags: []
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Auto-apply search filter
                  onFilter({
                    searchTerm: e.target.value,
                    folder: selectedFolder,
                    selectedTags
                  });
                }}
                aria-label="Search recipes"
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              Clear All
            </Button>
          </div>

          {/* Folder Filter */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Folder className="h-4 w-4" />
              Folder
            </Label>
            <Select value={selectedFolder} onValueChange={(value) => {
              setSelectedFolder(value);
              onFilter({
                searchTerm,
                folder: value,
                selectedTags
              });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All folders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All folders</SelectItem>
                {folders?.map((folder) => (
                  <SelectItem key={folder} value={folder || ''}>{folder}</SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Filter */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {(allTags || []).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/20 text-xs sm:text-sm px-2 py-1 touch-manipulation"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedFolder || selectedTags.length > 0) && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedFolder && (
                  <Badge variant="outline" className="gap-1">
                    <Folder className="h-3 w-3" />
                    {selectedFolder}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setSelectedFolder('');
                        onFilter({
                          searchTerm,
                          folder: '',
                          selectedTags
                        });
                      }}
                    />
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};