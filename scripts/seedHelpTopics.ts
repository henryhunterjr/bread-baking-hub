// ts-node scripts/seedHelpTopics.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const raw = fs.readFileSync('scripts/seeds/help_topics.json', 'utf8');
  const topics = JSON.parse(raw);

  for (const t of topics) {
    const { error } = await supabase
      .from('help_topics')
      .upsert({ ...t, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) {
      console.error('Upsert help topic failed:', t.key, error.message);
      process.exitCode = 1;
    } else {
      console.log('Upserted help topic:', t.key);
    }
  }
})();