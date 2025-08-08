import { Search } from 'lucide-react';
import { logger } from '@/utils/logger';

interface SimpleSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const SimpleSearch = ({ searchQuery, onSearchChange, className }: SimpleSearchProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    logger.log('🔍 SimpleSearch input changed:', value);
    logger.log('🔍 Event timestamp:', new Date().toISOString());
    logger.log('🔍 Calling onSearchChange with:', value);
    onSearchChange(value);
    logger.log('🔍 onSearchChange called successfully');
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search blog posts…"
          value={searchQuery}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-card border-primary/20 focus:border-primary"
        />
      </div>
    </div>
  );
};

export default SimpleSearch;