// ts-node scripts/ingestContent.ts "all|recipes|blog|glossary"
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!; // embeddings

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

type Item = {
  type: 'recipe'|'blog'|'glossary';
  title: string; slug: string; url: string;
  summary: string; body_text: string; tags: string[];
};

async function fetchSource(kind: string): Promise<Item[]> {
  if (kind === 'recipes' || kind === 'all') {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, slug, tags, summary, method, ingredients, is_public')
      .eq('is_public', true);
    if (error) throw error;
    const items = (data || []).map((r: any) => ({
      type: 'recipe',
      title: r.title,
      slug: r.slug,
      url: `/recipes/${r.slug}`,
      summary: r.summary || '',
      body_text: [r.title, r.summary, 'Ingredients:', (r.ingredients||[]).join('\n'), 'Method:', (r.method||[]).join('\n')].join('\n\n'),
      tags: (r.tags||[]).map((t:string)=>t.toLowerCase())
    }));
    return items as Item[];
  }

  if (kind === 'blog' || kind === 'all') {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('title, slug, tags, excerpt, body, is_draft')
      .eq('is_draft', false);
    if (error) throw error;
    const items = (data || []).map((p:any)=>({
      type: 'blog',
      title: p.title,
      slug: p.slug,
      url: `/blog/${p.slug}`,
      summary: p.excerpt || (p.body||'').slice(0, 220),
      body_text: `${p.title}\n\n${p.body||''}`,
      tags: (p.tags||[]).map((t:string)=>t.toLowerCase())
    }));
    return items as Item[];
  }

  if (kind === 'glossary' || kind === 'all') {
    const { data, error } = await supabase
      .from('glossary')
      .select('term, slug, definition, related_terms');
    if (error) throw error;
    const items = (data || []).map((g:any)=>({
      type: 'glossary',
      title: g.term,
      slug: g.slug,
      url: `/glossary/${g.slug}`,
      summary: (g.definition||'').slice(0, 220),
      body_text: `${g.term}\n\n${g.definition||''}\n\nRelated: ${(g.related_terms||[]).join(', ')}`,
      tags: (g.related_terms||[]).map((t:string)=>t.toLowerCase())
    }));
    return items as Item[];
  }

  return [];
}

function chunkText(txt: string, maxChars = 4000, overlap = 400) {
  const out:string[] = [];
  let i = 0;
  while (i < txt.length) {
    out.push(txt.slice(i, i + maxChars));
    i += maxChars - overlap;
  }
  return out;
}

async function embed(texts: string) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts
  });
  return res.data[0].embedding as number[];
}

async function embedMany(chunks: string[]) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunks
  });
  return res.data.map(d => d.embedding as number[]);
}

async function upsertItem(i: Item) {
  const { data, error } = await supabase
    .from('content_items')
    .upsert({
      type: i.type, title: i.title, slug: i.slug, url: i.url,
      summary: i.summary, body_text: i.body_text, tags: i.tags,
      updated_at: new Date().toISOString()
    }, { onConflict: 'slug' })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

async function upsertEmbeddings(contentId: string, body: string) {
  const chunks = chunkText(body);
  const embs = await embedMany(chunks);

  // wipe old
  await supabase.from('content_embeddings').delete().eq('content_id', contentId);

  const rows = embs.map((e, idx) => ({
    content_id: contentId,
    chunk_index: idx,
    embedding: e as unknown as any,
    text_chunk: chunks[idx],
    updated_at: new Date().toISOString()
  }));
  const { error } = await supabase.from('content_embeddings').insert(rows);
  if (error) throw error;
}

(async () => {
  const kind = process.argv[2] || 'all';
  const sets = kind === 'all' ? ['recipes','blog','glossary'] : [kind];

  for (const k of sets) {
    console.log('Ingesting:', k);
    const items = await fetchSource(k);
    for (const it of items) {
      try {
        const id = await upsertItem(it);
        await upsertEmbeddings(id, it.body_text || it.summary || it.title);
        console.log('✓', it.type, it.slug);
      } catch (e:any) {
        console.error('✗', it.slug, e.message);
      }
    }
  }
  console.log('Done');
})();