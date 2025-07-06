import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { History, Calendar, Search, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import TroubleshootingTable from '@/components/TroubleshootingTable';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

const TroubleshootingPage: React.FC = () => {
  const { history, symptoms, loadSymptoms } = useStore();
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  
  // Load symptoms data
  useEffect(() => {
    if (symptoms.length === 0) {
      try {
        import('@/data/symptoms.json').then((data) => {
          loadSymptoms(data.symptoms);
        }).catch((error) => {
          console.warn('Failed to load symptoms data:', error);
        });
      } catch (error) {
        console.warn('Error importing symptoms data:', error);
      }
    }
  }, [symptoms.length, loadSymptoms]);

  // Get the latest scan results
  const latestScan = history.length > 0 ? history[history.length - 1] : null;
  const hasNoIssues = latestScan && latestScan.symptomIds.length === 0;
  
  // Get symptoms for selected scan
  const getSelectedSymptoms = () => {
    if (selectedScan === null) return [];
    const scanRecord = history[selectedScan];
    if (!scanRecord) return [];
    
    return symptoms.filter(symptom => 
      scanRecord.symptomIds.includes(symptom.id)
    );
  };

  const clearHistory = () => {
    // This would need to be added to the store
    console.log('Clear history functionality would go here');
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Bread Troubleshooting
          </h1>
          <p className="text-muted-foreground">
            Analyze your bread issues and track your progress over time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Scan History
                  </CardTitle>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-4">
                    <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No scans yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {history.map((scan, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedScan === index 
                            ? 'bg-primary/10 border-primary' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedScan(selectedScan === index ? null : index)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {format(new Date(scan.timestamp), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {format(new Date(scan.timestamp), 'h:mm a')}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {scan.symptomIds.length === 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              No issues
                            </Badge>
                          ) : (
                            scan.symptomIds.slice(0, 2).map(id => (
                              <Badge key={id} variant="outline" className="text-xs">
                                {id.split('-')[0]}...
                              </Badge>
                            ))
                          )}
                          {scan.symptomIds.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{scan.symptomIds.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedScan !== null ? (
              // Show selected scan details
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Scan Results from {format(new Date(history[selectedScan].timestamp), 'MMMM d, yyyy')}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedScan(null)}
                  >
                    ← Back to Current View
                  </Button>
                </div>
                
                {history[selectedScan].symptomIds.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-4">
                    {getSelectedSymptoms().map(symptom => (
                      <Card key={symptom.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {symptom.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </CardTitle>
                          <Badge variant="secondary" className="w-fit">
                            {symptom.category}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Quick Fix</h4>
                              <p className="text-sm bg-secondary/30 p-3 rounded">
                                {symptom.quickFix}
                              </p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Deep Dive</h4>
                              <p className="text-sm text-muted-foreground">
                                {symptom.deepDive}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : hasNoIssues ? (
              // Show empty state if latest scan has no issues
              <EmptyState />
            ) : (
              // Show troubleshooting table by default
              <TroubleshootingTable />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TroubleshootingPage;