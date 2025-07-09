import { useState, useMemo } from 'react';

interface SearchableItem {
  title: string;
  excerpt: string;
  tags: string[];
}

export const useSimpleSearch = <T extends SearchableItem>(items: T[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const searchLower = searchQuery.toLowerCase();
    console.log('useSimpleSearch filtering with:', searchLower, 'items count:', items.length);
    
    const filtered = items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const excerptMatch = item.excerpt.toLowerCase().includes(searchLower);
      const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      return titleMatch || excerptMatch || tagMatch;
    });
    
    console.log('Filtered result count:', filtered.length);
    return filtered;
  }, [items, searchQuery]);

  const handleSearchChange = (query: string) => {
    console.log('Search query changed to:', query);
    setSearchQuery(query);
  };

  return {
    searchQuery,
    filteredItems,
    handleSearchChange
  };
};