import { useState } from 'react';
import SimpleSearch from './SimpleSearch';
import { useSimpleSearch } from '@/hooks/useSimpleSearch';

// Test data
const mockPosts = [
  {
    id: '1',
    title: 'Perfect Sourdough Starter',
    excerpt: 'Learn how to create and maintain a healthy sourdough starter',
    tags: ['sourdough', 'starter', 'fermentation']
  },
  {
    id: '2', 
    title: 'Troubleshooting Dense Bread',
    excerpt: 'Common causes and solutions for dense, heavy bread',
    tags: ['troubleshooting', 'dense', 'texture']
  },
  {
    id: '3',
    title: 'Best Flour for Bread Making',
    excerpt: 'A comprehensive guide to choosing the right flour',
    tags: ['flour', 'ingredients', 'guide']
  }
];

const TestSearchPage = () => {
  const { searchQuery, filteredItems, handleSearchChange } = useSimpleSearch(mockPosts);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Test Page</h1>
      
      <SimpleSearch 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        className="mb-8"
      />
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Results: {filteredItems.length} of {mockPosts.length} posts
        </p>
        
        {filteredItems.map(post => (
          <div key={post.id} className="border border-border rounded-lg p-4">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-muted-foreground mb-2">{post.excerpt}</p>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-muted px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && searchQuery && (
          <p className="text-center text-muted-foreground py-8">
            No posts found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default TestSearchPage;