import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter } from 'lucide-react';
import { WordPressCategory } from '@/utils/blogFetcher';

interface CategoryFilterProps {
  categories: WordPressCategory[];
  selectedCategory: number | undefined;
  showFilters: boolean;
  categoriesLoading: boolean;
  onToggleFilters: () => void;
  onCategoryChange: (categoryId: number | undefined) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  showFilters,
  categoriesLoading,
  onToggleFilters,
  onCategoryChange
}: CategoryFilterProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter by Category
        </Button>
        
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(undefined)}
            >
              All Posts
            </Button>
            {categoriesLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;