import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import TroubleshootingTable from '@/components/TroubleshootingTable';
import TroubleshootingCard from '@/components/TroubleshootingCard';
import CommunityBridge from '@/components/CommunityBridge';
import EmptyState from '@/components/EmptyState';
import { Grid3X3, Table, ChevronRight, ChevronDown } from 'lucide-react';

interface Symptom {
  id: string;
  category: string;
  labels: string[];
  quickFix: string;
  deepDive: string;
  images: { before: string; after: string };
}

interface TroubleshootingContentProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  results: string[] | null;
  symptoms: Symptom[];
  expandedCards: Set<string>;
  toggleCardExpansion: (cardId: string) => void;
}

export default function TroubleshootingContent({ 
  viewMode, 
  setViewMode, 
  results, 
  symptoms, 
  expandedCards, 
  toggleCardExpansion 
}: TroubleshootingContentProps) {
  return (
    <div>
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">View:</span>
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <Switch
                checked={viewMode === 'table'}
                onCheckedChange={(checked) => setViewMode(checked ? 'table' : 'grid')}
                className="focus:ring-2 focus:ring-primary"
              />
              <Table className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">
              {viewMode === 'table' ? 'Table View' : 'Grid View'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          {results === null ? (
            viewMode === 'table' ? (
              <TroubleshootingTable />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {symptoms.map(symptom => (
                  <Card key={symptom.id} className="bg-card text-card-foreground hover:bg-muted/50 transition-all duration-300 cursor-pointer py-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-primary">
                        {symptom.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="capitalize">
                          {symptom.category}
                        </Badge>
                        {symptom.labels.slice(0, 2).map((label) => (
                          <Badge 
                            key={label}
                            variant="outline" 
                            className="text-xs hover:bg-primary/20"
                            title={symptom.quickFix}
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="hidden md:block">
                        <p className="text-sm text-muted-foreground mb-3">
                          {symptom.quickFix}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCardExpansion(symptom.id)}
                          className="w-full hover:bg-primary/20 focus:ring-2 focus:ring-primary"
                        >
                          {expandedCards.has(symptom.id) ? (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-4 w-4 mr-2" />
                              View Details
                            </>
                          )}
                        </Button>
                        {expandedCards.has(symptom.id) && (
                          <div className="mt-4 p-4 bg-background rounded-lg border animate-accordion-down">
                            <TroubleshootingCard symptom={symptom} />
                          </div>
                        )}
                      </div>
                      <div className="md:hidden">
                        <TroubleshootingCard symptom={symptom} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : results.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {results.map(id => {
                const symptom = symptoms.find(s => s.id === id);
                return symptom ? (
                  <div key={id} className="ring-2 ring-primary rounded-lg p-4 bg-primary/10 animate-fade-in">
                    <TroubleshootingCard symptom={symptom} />
                    <div className="mt-4">
                      <CommunityBridge symptomId={id} />
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
    </div>
  );
}