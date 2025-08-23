import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  'https://ojyckskucneljvuqzrsw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY'
);

export async function findByStructuredQuery(q: { title?: string; slug?: string; tags?: string[]; type?: string }) {
  let query = supabase.from('content_items').select('*');
  if (q.type) query = query.eq('type', q.type);
  if (q.slug) query = query.eq('slug', q.slug);
  if (q.title) query = query.ilike('title', q.title);
  if (q.tags?.length) query = query.overlaps('tags', q.tags.map(t=>t.toLowerCase()));
  const { data } = await query.limit(5);
  return data || [];
}

export async function findByFuzzy(text: string, type?: string) {
  let query = supabase.from('content_items').select('*').ilike('title', `%${text}%`);
  if (type) query = query.eq('type', type);
  const { data } = await query.limit(8);
  return data || [];
}

export async function semanticSearch(prompt: string, type?: string, k=6) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const emb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: prompt });
  const queryEmbedding = emb.data[0].embedding;

  const { data } = await supabase.rpc('match_content', {
    query_embedding: queryEmbedding,
    match_count: k,
    filter_type: type || null
  });
  return data || [];
}

export async function getItemById(id: string) {
  const { data } = await supabase.from('content_items').select('*').eq('id', id).single();
  return data;
}

export async function getHelpTopic(key: string) {
  const { data } = await supabase.from('help_topics').select('*').eq('key', key).single();
  return data || null;
}