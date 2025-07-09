import { Search } from 'lucide-react';

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const BlogSearch = ({ searchQuery, onSearchChange, className }: BlogSearchProps) => {
  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search blog posts…"
          value={searchQuery}
          onChange={(e) => {
            console.log('SEARCH EVENT FIRED:', e.target.value);
            console.log('Event object:', e);
            onSearchChange(e.target.value);
          }}
          onInput={(e) => {
            console.log('INPUT EVENT FIRED:', (e.target as HTMLInputElement).value);
          }}
          onKeyUp={(e) => {
            console.log('KEYUP EVENT FIRED:', (e.target as HTMLInputElement).value);
          }}
          onClick={() => console.log('INPUT CLICKED')}
          onFocus={() => console.log('INPUT FOCUSED')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-card border-primary/20 focus:border-primary"
        />
      </div>
    </div>
  );
};

export default BlogSearch;