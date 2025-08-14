import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LighthouseAudit from "@/components/LighthouseAudit";
import PerformanceAudit from "@/components/PerformanceAudit";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Monitor, Zap, Globe } from "lucide-react";

const PerformanceTestingPage = () => {
  return (
    <PerformanceMonitor>
      <div className="bg-background text-foreground min-h-screen">
        <Helmet>
          <title>Performance Testing Dashboard | Baking Great Bread</title>
          <meta name="description" content="Comprehensive performance monitoring and testing dashboard for Core Web Vitals, Lighthouse audits, and real-time metrics." />
          <link rel="canonical" href="https://bread-baking-hub.vercel.app/performance-testing" />
          <meta property="og:title" content="Performance Testing Dashboard | Baking Great Bread" />
          <meta property="og:description" content="Monitor and optimize website performance with real-time metrics and audits." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-primary">Performance Testing Dashboard</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Monitor Core Web Vitals, run Lighthouse audits, and track real-time performance metrics
                to ensure optimal user experience and launch readiness.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Monitor className="h-3 w-3 mr-1" />
                  Real-time Monitoring
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Core Web Vitals
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Lighthouse Audits
                </Badge>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <Globe className="h-3 w-3 mr-1" />
                  Production Ready
                </Badge>
              </div>
            </div>

            {/* Status Alert */}
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Launch Readiness Status:</strong> Performance testing is active. 
                Monitor these metrics to ensure your application meets production standards 
                before deployment.
              </AlertDescription>
            </Alert>

            {/* Performance Testing Tabs */}
            <Tabs defaultValue="lighthouse" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lighthouse" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Lighthouse Audit
                </TabsTrigger>
                <TabsTrigger value="realtime" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Real-time Metrics
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Performance Monitor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lighthouse" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lighthouse Performance Audit</CardTitle>
                    <CardDescription>
                      Comprehensive audit including Performance, Accessibility, Best Practices, 
                      and SEO scores along with Core Web Vitals measurements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LighthouseAudit />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realtime" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Performance Metrics</CardTitle>
                    <CardDescription>
                      Live performance data including bundle analysis, resource loading times,
                      and user experience metrics collected from actual browser sessions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PerformanceAudit />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monitoring" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Background Performance Monitoring</CardTitle>
                    <CardDescription>
                      Continuous monitoring service that tracks performance metrics in the background,
                      optimizes resource loading, and provides insights for ongoing improvements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 space-y-4">
                      <Monitor className="h-12 w-12 mx-auto text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">Background Monitoring Active</h3>
                        <p className="text-muted-foreground">
                          The PerformanceMonitor component is running in the background, 
                          collecting metrics and optimizing your application automatically.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 border rounded-lg">
                          <h4 className="font-semibold text-green-600">Service Worker</h4>
                          <p className="text-sm text-muted-foreground">
                            Registered for offline support and background sync
                          </p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <h4 className="font-semibold text-blue-600">Resource Preloading</h4>
                          <p className="text-sm text-muted-foreground">
                            Critical resources are preloaded for faster navigation
                          </p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <h4 className="font-semibold text-purple-600">Memory Tracking</h4>
                          <p className="text-sm text-muted-foreground">
                            JS heap usage monitored and reported periodically
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Performance Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Goals & Standards</CardTitle>
                <CardDescription>
                  Target metrics for production-ready performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">≤ 2.5s</div>
                    <div className="text-sm font-semibold">LCP Target</div>
                    <div className="text-xs text-muted-foreground">Largest Contentful Paint</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">≤ 100ms</div>
                    <div className="text-sm font-semibold">FID Target</div>
                    <div className="text-xs text-muted-foreground">First Input Delay</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">≤ 0.1</div>
                    <div className="text-sm font-semibold">CLS Target</div>
                    <div className="text-xs text-muted-foreground">Cumulative Layout Shift</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">≥ 90</div>
                    <div className="text-sm font-semibold">Lighthouse Score</div>
                    <div className="text-xs text-muted-foreground">Performance Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </PerformanceMonitor>
  );
};

export default PerformanceTestingPage;