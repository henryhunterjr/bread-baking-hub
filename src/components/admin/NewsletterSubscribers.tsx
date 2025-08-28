import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Mail, Search, Users } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  facebook_group_member: boolean | null;
  created_at: string;
  subscribed_at: string | null;
}

export const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load newsletter subscribers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribers = () => {
    const activeSubscribers = subscribers.filter(sub => sub.active);
    const csvContent = [
      ['Email', 'Name', 'Facebook Group Member', 'Subscribed Date'].join(','),
      ...activeSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.facebook_group_member ? 'Yes' : 'No',
        new Date(sub.subscribed_at || sub.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = !searchTerm || 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActiveFilter = !showActiveOnly || subscriber.active;
    
    return matchesSearch && matchesActiveFilter;
  });

  const activeCount = subscribers.filter(sub => sub.active).length;
  const totalCount = subscribers.length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading subscribers...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {subscribers.filter(sub => sub.facebook_group_member).length}
                </p>
                <p className="text-sm text-muted-foreground">Facebook Group Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Newsletter Subscribers
            <Button onClick={exportSubscribers} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant={showActiveOnly ? "default" : "outline"}
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              {showActiveOnly ? "Active Only" : "All Subscribers"}
            </Button>
          </div>

          {/* Subscribers Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Facebook Group</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No subscribers found</p>
                        {searchTerm && (
                          <p className="text-sm">Try adjusting your search terms</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        {subscriber.name || <span className="text-muted-foreground italic">No name</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscriber.active ? "default" : "secondary"}>
                          {subscriber.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscriber.facebook_group_member ? "default" : "outline"}>
                          {subscriber.facebook_group_member ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribed_at || subscriber.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};