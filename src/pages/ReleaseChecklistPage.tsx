import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReleaseChecklist from '@/components/ReleaseChecklist';
import AccessibilityAudit from '@/components/AccessibilityAudit';
import PerformanceAudit from '@/components/PerformanceAudit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkLovableUploads, highlightLovableUploadViolations, clearLovableUploadHighlights } from '@/utils/lovableUploadsChecker';
import { runSEOAudit, generateSEOReport } from '@/utils/seoAudit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Search, Zap, Eye, FileText } from 'lucide-react';

const ReleaseChecklistPage = () => {
  const [uploadViolations, setUploadViolations] = React.useState<any[]>([]);
  const [seoReport, setSeoReport] = React.useState<any>(null);

  const runUploadCheck = () => {
    const violations = checkLovableUploads();
    setUploadViolations(violations);
    
    if (violations.length > 0) {
      highlightLovableUploadViolations();
    } else {
      clearLovableUploadHighlights();
    }
  };

  const runSEOCheck = () => {
    const report = generateSEOReport();
    setSeoReport(report);
  };

  React.useEffect(() => {
    // Auto-run checks on load
    runUploadCheck();
    runSEOCheck();

    return () => {
      clearLovableUploadHighlights();
    };
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Release Checklist | Bread Baking Hub</title>
        <meta name="description" content="Pre-deployment checklist and quality assurance tools" />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Release Checklist & Quality Assurance</h1>
          <p className="text-muted-foreground max-w-2xl">
            Comprehensive pre-deployment checklist to ensure production readiness. 
            Run these checks before releasing to production.
          </p>
        </div>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Uploads
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <ReleaseChecklist />
          </TabsContent>

          <TabsContent value="uploads">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    /lovable-uploads/ Detection
                  </CardTitle>
                  <Button onClick={runUploadCheck} variant="outline">
                    Run Check
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {uploadViolations.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      No violations found!
                    </h3>
                    <p className="text-green-600">
                      All assets are using permanent storage locations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">
                        {uploadViolations.length} violations found
                      </span>
                    </div>
                    
                    {uploadViolations.map((violation, index) => (
                      <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="font-medium text-red-800">
                          {violation.attribute}: {violation.value}
                        </div>
                        <div className="text-sm text-red-600 mt-1">
                          {violation.suggestion}
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">How to fix:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Move images to /src/assets/ and import them as ES6 modules</li>
                        <li>• Upload to Supabase Storage and use the public URL</li>
                        <li>• Update any hardcoded /lovable-uploads/ paths in the code</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Audit
                    {seoReport && (
                      <span className={`text-2xl font-bold ml-4 ${
                        seoReport.score >= 90 ? 'text-green-600' :
                        seoReport.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {seoReport.score}/100
                      </span>
                    )}
                  </CardTitle>
                  <Button onClick={runSEOCheck} variant="outline">
                    Run SEO Check
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {seoReport ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {seoReport.summary.errors}
                        </div>
                        <div className="text-sm text-muted-foreground">Errors</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {seoReport.summary.warnings}
                        </div>
                        <div className="text-sm text-muted-foreground">Warnings</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {seoReport.summary.infos}
                        </div>
                        <div className="text-sm text-muted-foreground">Info</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {seoReport.issues.map((issue: any, index: number) => (
                        <div key={index} className={`p-4 border rounded-lg ${
                          issue.type === 'error' ? 'border-red-200 bg-red-50' :
                          issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                          'border-blue-200 bg-blue-50'
                        }`}>
                          <div className="font-medium">
                            {issue.description}
                          </div>
                          {issue.element && (
                            <div className="text-sm mt-1 font-mono">
                              {issue.element}
                            </div>
                          )}
                          <div className="text-sm mt-2">
                            <strong>Fix:</strong> {issue.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Run SEO Check" to analyze this page</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceAudit />
          </TabsContent>

          <TabsContent value="accessibility">
            <AccessibilityAudit />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReleaseChecklistPage;