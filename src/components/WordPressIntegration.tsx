/**
 * WordPress Integration Component
 * Demonstrates how to use WordPress content for OG signals and content discovery
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ExternalLink, 
  Search, 
  Clock, 
  Tag, 
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import { 
  getWordPressPosts, 
  getLatestPostsForSignals, 
  searchWordPressContent,
  generateOGSignalsFromPost,
  generateStructuredDataFromPost
} from '@/utils/wordpressIntegration';

interface WordPressIntegrationProps {
  className?: string;
}

export const WordPressIntegration: React.FC<WordPressIntegrationProps> = ({ 
  className = "" 
}) => {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [ogSignals, setOgSignals] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Load latest posts on component mount
  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      setIsLoading(true);
      const { posts, cached } = await getLatestPostsForSignals(5);
      setLatestPosts(posts);
      
      if (posts.length > 0) {
        // Demo: Generate OG signals for first post
        const fullPosts = await getWordPressPosts({ perPage: 1 });
        if (fullPosts.posts.length > 0) {
          const firstPost = fullPosts.posts[0];
          setSelectedPost(firstPost);
          const signals = generateOGSignalsFromPost(firstPost);
          setOgSignals(signals);
        }
      }
    } catch (error) {
      console.error('Failed to load latest posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const { posts } = await searchWordPressContent(query, 5);
      setSearchResults(posts);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const generateStructuredData = () => {
    if (!selectedPost) return null;
    return generateStructuredDataFromPost(selectedPost);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">WordPress Integration</h2>
          <p className="text-sm text-muted-foreground">
            OG signals, content discovery, and structured data from WordPress
          </p>
        </div>
        <Button variant="outline" onClick={loadLatestPosts} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Latest Posts for Content Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Latest WordPress Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="space-y-4">
              {latestPosts.map((post, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  {post.image && (
                    <div className="flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-1">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(post.publishedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No WordPress posts available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Content Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Content Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search WordPress content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <Button 
                onClick={() => handleSearch(searchQuery)}
                disabled={isSearching}
              >
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Search Results:</h4>
                {searchResults.map((result, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h5 className="font-medium">{result.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Relevance: {result.relevance}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* OG Signals Demo */}
      {ogSignals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Generated OG Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium">Title:</label>
                  <p className="text-muted-foreground">{ogSignals.title}</p>
                </div>
                <div>
                  <label className="font-medium">Type:</label>
                  <p className="text-muted-foreground">{ogSignals.type}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="font-medium">Description:</label>
                  <p className="text-muted-foreground">{ogSignals.description}</p>
                </div>
                <div>
                  <label className="font-medium">URL:</label>
                  <p className="text-muted-foreground truncate">{ogSignals.url}</p>
                </div>
                <div>
                  <label className="font-medium">Section:</label>
                  <p className="text-muted-foreground">{ogSignals.section || 'None'}</p>
                </div>
                {ogSignals.image && (
                  <div className="md:col-span-2">
                    <label className="font-medium flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      Featured Image:
                    </label>
                    <div className="mt-2">
                      <img 
                        src={ogSignals.image} 
                        alt={ogSignals.imageAlt}
                        className="h-24 w-auto rounded border"
                      />
                    </div>
                  </div>
                )}
                {ogSignals.tags && ogSignals.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="font-medium">Tags:</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ogSignals.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Structured Data Preview */}
              <div className="mt-6">
                <label className="font-medium">Generated JSON-LD Schema:</label>
                <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                  {JSON.stringify(generateStructuredData(), null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WordPressIntegration;