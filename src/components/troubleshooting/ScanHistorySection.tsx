import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { RotateCcw } from 'lucide-react';

interface Symptom {
  id: string;
  category: string;
  labels: string[];
  quickFix: string;
  deepDive: string;
  images: { before: string; after: string };
}

interface HistoryEntry {
  timestamp: number;
  symptomIds: string[];
}

interface ScanHistorySectionProps {
  history: HistoryEntry[];
  symptoms: Symptom[];
  onHistoryClick: (entry: HistoryEntry) => void;
  onRerunScan: (entry: HistoryEntry) => void;
}

export default function ScanHistorySection({ history, symptoms, onHistoryClick, onRerunScan }: ScanHistorySectionProps) {
  const renderHistoryCard = (entry: HistoryEntry, index: number, maxBadges: number) => (
    <Card key={index} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onHistoryClick(entry)}
            className="flex-1 cursor-pointer"
          >
            <div className="text-sm font-medium">
              {format(new Date(entry.timestamp), 'MMM d, yyyy')}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.symptomIds.slice(0, maxBadges).map(id => {
                const symptom = symptoms.find(s => s.id === id);
                return symptom ? (
                  <Badge key={id} variant="secondary" className="text-xs">
                    {symptom.category}
                  </Badge>
                ) : null;
              })}
              {entry.symptomIds.length > maxBadges && (
                <Badge variant="outline" className="text-xs">
                  +{entry.symptomIds.length - maxBadges}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRerunScan(entry)}
            className="ml-2 hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-400"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full lg:w-1/4">
      {/* Mobile Accordion */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="history">
            <AccordionTrigger className="text-lg font-semibold">
              Scan History ({history.length})
            </AccordionTrigger>
            <AccordionContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No scans yet</p>
              ) : (
                <div className="space-y-3 py-2">
                  {history.map((entry, index) => renderHistoryCard(entry, index, 3))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scans yet</p>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <Card key={index} className="bg-background hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div 
                          onClick={() => onHistoryClick(entry)}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-sm font-medium">
                            {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.symptomIds.slice(0, 2).map(id => {
                              const symptom = symptoms.find(s => s.id === id);
                              return symptom ? (
                                <Badge key={id} variant="secondary" className="text-xs">
                                  {symptom.category}
                                </Badge>
                              ) : null;
                            })}
                            {entry.symptomIds.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{entry.symptomIds.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRerunScan(entry)}
                          className="ml-2 hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-400"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}