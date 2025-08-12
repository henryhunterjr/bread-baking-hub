import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Download } from 'lucide-react';

export type Subscriber = Tables<'newsletter_subscribers'>;

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setSubscribers(data || []);
      } catch (error) {
        console.error('Error loading subscribers', error);
        toast({ title: 'Error', description: 'Failed to load subscribers', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (onlyActive && s.active === false) return false;
      if (!q) return true;
      return (
        s.email.toLowerCase().includes(q) ||
        (s.name || '').toLowerCase().includes(q)
      );
    });
  }, [subscribers, search, onlyActive]);

  const updateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    setSavingId(id);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      setSubscribers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
      toast({ title: 'Saved', description: 'Subscriber updated.' });
    } catch (error) {
      console.error('Update error', error);
      toast({ title: 'Save failed', description: "Couldn't save subscriber.", variant: 'destructive' });
    } finally {
      setSavingId(null);
    }
  };

  const exportCsv = () => {
    const rows = filtered;
    const headers = ['email', 'name', 'active', 'subscribed_at', 'created_at', 'id'];
    const csv = [
      headers.join(','),
      ...rows.map((r) => [
        r.email,
        r.name || '',
        String(r.active ?? true),
        r.subscribed_at || '',
        r.created_at || '',
        r.id,
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Subscribers</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email or name..."
            aria-label="Search subscribers"
            className="max-w-xs"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active only</span>
            <Switch checked={onlyActive} onCheckedChange={setOnlyActive} />
          </div>
          <Button variant="outline" onClick={exportCsv} aria-label="Export CSV">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>{filtered.length} {filtered.length === 1 ? 'subscriber' : 'subscribers'}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Subscribed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No subscribers found</TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.email}</TableCell>
                  <TableCell>
                    <Input
                      defaultValue={s.name || ''}
                      placeholder="Add name"
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val !== (s.name || '')) updateSubscriber(s.id, { name: val || null });
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      disabled={savingId === s.id}
                      className="h-8 max-w-xs"
                      aria-label="Edit subscriber name"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={s.active ?? true}
                      onCheckedChange={(checked) => updateSubscriber(s.id, { active: checked })}
                      aria-label="Toggle active"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.subscribed_at ? new Date(s.subscribed_at).toLocaleString() : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminSubscribers;
