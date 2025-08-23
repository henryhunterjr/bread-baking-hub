import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types
interface ContentItem {
  id: string;
  type: 'recipe' | 'blog' | 'glossary' | 'help';
  title: string;
  slug: string;
  url: string;
  summary?: string;
  body_text: string;
  tags: string[];
  metadata: any;
}

interface ScoredChunk {
  content_id: string;
  chunk_index: number;
  text_chunk: string;
  similarity: number;
}

interface HelpTopic {
  key: string;
  title: string;
  audience: string[];
  summary: string;
  steps: string[];
  links: Array<{ label: string; url: string }>;
}

interface RetrievalPlan {
  type: 'help' | 'recipe' | 'blog' | 'glossary' | 'admin' | 'generic';
  searchTerms: string[];
  intent: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Henry's admin email - only this account gets admin features
const ADMIN_EMAIL = 'henrysbreadkitchen@gmail.com';

// Retrieval functions
async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const { data: user } = await supabase.auth.admin.getUserById(userId);
    return user?.user?.email === ADMIN_EMAIL;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

async function findByStructuredQuery(query: {
  title?: string;
  slug?: string;
  tags?: string[];
  type?: string;
}): Promise<ContentItem[]> {
  console.log('Structured query:', query);
  
  let supabaseQuery = supabase
    .from('content_items')
    .select('*')
    .limit(10);

  if (query.type) {
    supabaseQuery = supabaseQuery.eq('type', query.type);
  }

  if (query.slug) {
    supabaseQuery = supabaseQuery.eq('slug', query.slug);
  }

  if (query.title) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query.title}%`);
  }

  if (query.tags && query.tags.length > 0) {
    supabaseQuery = supabaseQuery.overlaps('tags', query.tags);
  }

  const { data, error } = await supabaseQuery;
  
  if (error) {
    console.error('Structured query error:', error);
    return [];
  }

  return data || [];
}

async function findByFuzzy(text: string, type?: string): Promise<ContentItem[]> {
  console.log('Fuzzy search:', text, type);
  
  let query = supabase
    .from('content_items')
    .select('*')
    .limit(10);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query.or(
    `title.ilike.%${text}%,summary.ilike.%${text}%,body_text.ilike.%${text}%`
  );

  if (error) {
    console.error('Fuzzy search error:', error);
    return [];
  }

  return data || [];
}

async function generateEmbedding(text: string): Promise<number[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 1536
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate embedding');
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function semanticSearch(query: string, type?: string, k = 6): Promise<ScoredChunk[]> {
  console.log('Semantic search:', query, type);
  
  try {
    const queryEmbedding = await generateEmbedding(query);
    
    const { data, error } = await supabase.rpc('match_content_embeddings', {
      query_embedding: queryEmbedding,
      match_count: k,
      filter_type: type || null
    });

    if (error) {
      console.error('Semantic search error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Semantic search failed:', error);
    return [];
  }
}

async function getItemById(id: string): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Get item by ID error:', error);
    return null;
  }

  return data;
}

async function getHelpTopic(slugOrKey: string): Promise<HelpTopic | null> {
  const { data, error } = await supabase
    .from('help_topics')
    .select('*')
    .eq('key', slugOrKey)
    .single();

  if (error) {
    console.error('Get help topic error:', error);
    return null;
  }

  return data;
}

// Planning function
function pickRetrievalPlan(userMessage: string): RetrievalPlan {
  const message = userMessage.toLowerCase();
  
  // Help/navigation indicators
  if (/how do i|where is|how to|help me|show me how|explain how/.test(message)) {
    return {
      type: 'help',
      searchTerms: extractSearchTerms(message),
      intent: 'navigation_help'
    };
  }
  
  // Admin requests
  if (/dashboard|admin|manage|moderate/.test(message)) {
    return {
      type: 'admin',
      searchTerms: ['dashboard', 'admin'],
      intent: 'admin_access'
    };
  }
  
  // Recipe indicators
  if (/recipe|ingredients?|method|bake|bread|sourdough|instructions?/.test(message)) {
    return {
      type: 'recipe',
      searchTerms: extractSearchTerms(message),
      intent: 'recipe_request'
    };
  }
  
  // Blog indicators
  if (/blog|article|post|read|story/.test(message)) {
    return {
      type: 'blog',
      searchTerms: extractSearchTerms(message),
      intent: 'content_request'
    };
  }
  
  // Glossary indicators
  if (/what is|define|definition|meaning|term|glossary/.test(message)) {
    return {
      type: 'glossary',
      searchTerms: extractSearchTerms(message),
      intent: 'definition_request'
    };
  }
  
  return {
    type: 'generic',
    searchTerms: extractSearchTerms(message),
    intent: 'general_inquiry'
  };
}

function extractSearchTerms(message: string): string[] {
  // Remove common stop words and extract meaningful terms
  const stopWords = ['how', 'do', 'i', 'the', 'is', 'what', 'where', 'can', 'you', 'me', 'a', 'an'];
  const words = message.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return words.slice(0, 5); // Limit to 5 most relevant terms
}

// Response formatting functions
function formatRecipeResponse(item: ContentItem): string {
  const metadata = item.metadata || {};
  const ingredients = metadata.ingredients || [];
  const method = metadata.method || [];
  
  let response = `# ${item.title}\n\n`;
  
  if (item.summary) {
    response += `${item.summary}\n\n`;
  }
  
  if (ingredients.length > 0) {
    response += `**Ingredients:**\n`;
    ingredients.slice(0, 6).forEach((ing: any) => {
      response += `• ${ing.amount || ''} ${ing.ingredient || ing}\n`;
    });
    if (ingredients.length > 6) {
      response += `• ...and ${ingredients.length - 6} more ingredients\n`;
    }
    response += '\n';
  }
  
  if (method.length > 0) {
    response += `**Method:**\n`;
    method.slice(0, 4).forEach((step: any, index: number) => {
      response += `${index + 1}. ${step.instruction || step}\n`;
    });
    if (method.length > 4) {
      response += `...and ${method.length - 4} more steps\n`;
    }
    response += '\n';
  }
  
  response += `[Open full recipe](${item.url})`;
  
  return response;
}

function formatBlogResponse(item: ContentItem): string {
  let response = `# ${item.title}\n\n`;
  
  if (item.summary) {
    response += `${item.summary}\n\n`;
  }
  
  response += `[Read full article](${item.url})`;
  
  return response;
}

function formatGlossaryResponse(item: ContentItem): string {
  let response = `# ${item.title}\n\n`;
  response += `${item.body_text.slice(0, 300)}`;
  
  if (item.body_text.length > 300) {
    response += '...';
  }
  
  response += `\n\n[View in glossary](${item.url})`;
  
  return response;
}

function formatHelpResponse(topic: HelpTopic): string {
  let response = `# ${topic.title}\n\n`;
  response += `${topic.summary}\n\n`;
  
  if (topic.steps.length > 0) {
    response += `**Steps:**\n`;
    topic.steps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });
    response += '\n';
  }
  
  if (topic.links.length > 0) {
    response += `**Helpful links:**\n`;
    topic.links.forEach(link => {
      response += `• [${link.label}](${link.url})\n`;
    });
  }
  
  return response;
}

// Main retrieval function
async function retrieveContent(userMessage: string, userId?: string): Promise<string> {
  const plan = pickRetrievalPlan(userMessage);
  console.log('Retrieval plan:', plan);
  
  // Handle admin requests first
  if (plan.type === 'admin') {
    const adminStatus = userId ? await isAdmin(userId) : false;
    if (!adminStatus) {
      return "I can only provide dashboard access to the site administrator. Those features are admin-only.";
    } else {
      return "Access granted! Here's your [Admin Dashboard](/dashboard) with content management, user analytics, and moderation tools.";
    }
  }
  
  // Handle help requests
  if (plan.type === 'help') {
    const helpKeys = plan.searchTerms.map(term => {
      // Map common terms to help topic keys
      if (term.includes('save') || term.includes('pdf')) return 'print-pdf';
      if (term.includes('recipe') && term.includes('work')) return 'recipe-workspace';
      if (term.includes('troubleshoot')) return 'troubleshooting';
      if (term.includes('book')) return 'library';
      if (term.includes('glossary')) return 'glossary';
      if (term.includes('challenge')) return 'monthly-challenge';
      if (term.includes('krusty') || term.includes('chat')) return 'using-krusty';
      if (term.includes('voice')) return 'voice-features';
      return null;
    }).filter(Boolean);
    
    for (const key of helpKeys) {
      const topic = await getHelpTopic(key);
      if (topic) {
        return formatHelpResponse(topic);
      }
    }
  }
  
  // Try exact search first
  let items: ContentItem[] = [];
  
  // Extract potential recipe names, blog titles, etc.
  const searchTerms = plan.searchTerms;
  if (searchTerms.length > 0) {
    items = await findByStructuredQuery({
      title: searchTerms.join(' '),
      type: plan.type !== 'generic' ? plan.type : undefined,
      tags: searchTerms
    });
  }
  
  // If no exact matches, try fuzzy search
  if (items.length === 0 && searchTerms.length > 0) {
    items = await findByFuzzy(searchTerms.join(' '), plan.type !== 'generic' ? plan.type : undefined);
  }
  
  // If still no matches, try semantic search
  if (items.length === 0) {
    const chunks = await semanticSearch(userMessage, plan.type !== 'generic' ? plan.type : undefined);
    if (chunks.length > 0) {
      const topChunk = chunks[0];
      const item = await getItemById(topChunk.content_id);
      if (item) {
        items = [item];
      }
    }
  }
  
  // Format response based on content type
  if (items.length > 0) {
    const item = items[0];
    
    switch (item.type) {
      case 'recipe':
        return formatRecipeResponse(item);
      case 'blog':
        return formatBlogResponse(item);
      case 'glossary':
        return formatGlossaryResponse(item);
      case 'help':
        return formatHelpResponse(item as unknown as HelpTopic);
    }
  }
  
  // Fallback message
  return `I didn't find that specific content on our site. Let me provide some general baking advice instead!`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, recipeContext, mode } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Processing message:', message, 'User:', userId, 'Mode:', mode);

    // Get site content first
    const siteContent = await retrieveContent(message, userId);
    
    // Enhanced system prompt for RAG-aware Krusty
    const systemPrompt = `You are KRUSTY, the site-aware concierge for "Baking Great Bread at Home". 

PRIMARY RULE: I have already retrieved relevant site content for you. Use this content as your primary source and always provide site links when available.

RETRIEVED CONTENT:
${siteContent}

Your personality: You are knowledgeable, friendly, and passionate about helping bakers succeed. Keep responses conversational and natural.

Response guidelines:
1. If the retrieved content contains site-specific information (recipes, blog posts, help topics), use it as your primary source
2. Always include relevant links when they're provided in the retrieved content
3. For recipes: Show key ingredients and first few steps, then link to full recipe
4. For help topics: Provide the steps and helpful links
5. For blog posts: Give a summary and link to read more
6. If the retrieved content says "I didn't find that on our site", acknowledge this and provide general advice
7. Be concise and well-structured - use bullets and clear formatting
8. Always cite your sources with links when available

Additional context:
${recipeContext ? `Current recipe context: ${JSON.stringify(recipeContext)}` : 'No current recipe context.'}`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Generated response:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in krusty-rag-concierge function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});