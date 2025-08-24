import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  type: 'recipe' | 'blog' | 'glossary' | 'help';
  title: string;
  slug: string;
  url: string;
  summary?: string;
  body_text: string;
  tags: string[];
  metadata?: any;
}

interface ContentChunk {
  content_id: string;
  chunk_index: number;
  text_chunk: string;
  embedding: number[];
}

// Generate embeddings using OpenAI
async function generateEmbedding(text: string): Promise<number[]> {
  const { data, error } = await supabase.functions.invoke('generate-embedding', {
    body: { text }
  });

  if (error) throw error;
  return data.embedding;
}

// Chunk text into manageable pieces
function chunkText(text: string, maxTokens = 800, overlap = 100): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Add overlap
      const words = currentChunk.split(' ');
      currentChunk = words.slice(-overlap).join(' ') + ' ' + sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Strip HTML and normalize text
function normalizeText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Ingest a single content item
export async function ingestContentItem(item: ContentItem): Promise<void> {
  if (import.meta.env.DEV) console.log('Ingesting content item:', item.title);
  
  try {
    // Upsert content item
    const { data: contentItem, error: contentError } = await supabase
      .from('content_items')
      .upsert({
        type: item.type,
        title: item.title,
        slug: item.slug,
        url: item.url,
        summary: item.summary,
        body_text: item.body_text,
        tags: item.tags,
        metadata: item.metadata || {}
      }, {
        onConflict: 'type,slug'
      })
      .select()
      .single();

    if (contentError) throw contentError;

    // Delete existing embeddings for this content
    await supabase
      .from('content_embeddings')
      .delete()
      .eq('content_id', contentItem.id);

    // Generate chunks and embeddings
    const chunks = chunkText(item.body_text);
    const embeddingPromises = chunks.map(async (chunk, index) => {
      const embedding = await generateEmbedding(chunk);
      return {
        content_id: contentItem.id,
        chunk_index: index,
        text_chunk: chunk,
        embedding: `[${embedding.join(',')}]` // Convert array to pgvector string format
      };
    });

    const embeddings = await Promise.all(embeddingPromises);

    // Insert embeddings
    const { error: embeddingError } = await supabase
      .from('content_embeddings')
      .insert(embeddings);

    if (embeddingError) throw embeddingError;

    if (import.meta.env.DEV) console.log(`Successfully ingested ${item.title} with ${chunks.length} chunks`);
  } catch (error) {
    console.error('Error ingesting content item:', error);
    throw error;
  }
}

// Ingest recipes from the database
export async function ingestRecipes(): Promise<void> {
  if (import.meta.env.DEV) console.log('Ingesting recipes...');
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_public', true);

  if (error) throw error;

  for (const recipe of recipes) {
    const recipeData = recipe.data as any;
    const ingredients = recipeData?.ingredients || [];
    const method = recipeData?.method || [];
    
    let bodyText = `${recipe.title}\n\n`;
    
    if (recipeData?.description) {
      bodyText += `${recipeData.description}\n\n`;
    }
    
    if (ingredients.length > 0) {
      bodyText += 'Ingredients:\n';
      ingredients.forEach((ing: any) => {
        bodyText += `- ${ing.amount || ''} ${ing.ingredient || ing}\n`;
      });
      bodyText += '\n';
    }
    
    if (method.length > 0) {
      bodyText += 'Method:\n';
      method.forEach((step: any, index: number) => {
        bodyText += `${index + 1}. ${step.instruction || step}\n`;
      });
    }

    const contentItem: ContentItem = {
      type: 'recipe',
      title: recipe.title,
      slug: recipe.slug,
      url: `/recipes/${recipe.slug}`,
      summary: recipeData?.description?.slice(0, 200),
      body_text: bodyText,
      tags: recipe.tags || [],
      metadata: recipeData
    };

    await ingestContentItem(contentItem);
  }
}

// Ingest blog posts
export async function ingestBlogPosts(): Promise<void> {
  if (import.meta.env.DEV) console.log('Ingesting blog posts...');
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_draft', false);

  if (error) throw error;

  for (const post of posts) {
    const bodyText = `${post.title}\n\n${post.subtitle || ''}\n\n${normalizeText(post.content)}`;

    const contentItem: ContentItem = {
      type: 'blog',
      title: post.title,
      slug: post.slug,
      url: `/blog/${post.slug}`,
      summary: post.subtitle || post.content.slice(0, 200),
      body_text: bodyText,
      tags: post.tags || [],
      metadata: {
        hero_image_url: post.hero_image_url,
        published_at: post.published_at
      }
    };

    await ingestContentItem(contentItem);
  }
}

// Ingest help topics
export async function ingestHelpTopics(): Promise<void> {
  if (import.meta.env.DEV) console.log('Ingesting help topics...');
  
  const { data: topics, error } = await supabase
    .from('help_topics')
    .select('*');

  if (error) throw error;

  for (const topic of topics) {
    const bodyText = `${topic.title}\n\n${topic.summary}\n\nSteps:\n${topic.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}`;

    const contentItem: ContentItem = {
      type: 'help',
      title: topic.title,
      slug: topic.key,
      url: `/help#${topic.key}`,
      summary: topic.summary,
      body_text: bodyText,
      tags: topic.audience,
      metadata: {
        steps: topic.steps,
        links: topic.links
      }
    };

    await ingestContentItem(contentItem);
  }
}

// Full content ingestion
export async function ingestAllContent(): Promise<void> {
  if (import.meta.env.DEV) console.log('Starting full content ingestion...');
  
  try {
    await ingestRecipes();
    await ingestBlogPosts();
    await ingestHelpTopics();
    
    if (import.meta.env.DEV) console.log('Content ingestion completed successfully!');
  } catch (error) {
    console.error('Content ingestion failed:', error);
    throw error;
  }
}