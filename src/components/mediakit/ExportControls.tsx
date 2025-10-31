import { Download, Link2, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaKit } from "./MediaKitContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdminPanel from "./AdminPanel";

const ExportControls = () => {
  const { data, refreshData } = useMediaKit();
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Generation",
      description: "Your media kit PDF is being generated...",
    });
    // TODO: Implement PDF generation
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Media kit link has been copied to clipboard.",
    });
  };

  const handleCopyText = async () => {
    // Generate text summary
    const text = `
Henry Hunter - Media Kit

Total Community Reach: ${data.hero.totalReach.toLocaleString()}
Monthly Impressions: ${data.hero.monthlyImpressions.toLocaleString()}
Newsletter Subscribers: ${data.hero.newsletterSubscribers.toLocaleString()}

${data.hero.aboutText}

Contact: legacyaisystem@gmail.com | 312-721-2088
Website: https://bakinggreatbread.com
    `.trim();
    
    await navigator.clipboard.writeText(text);
    toast({
      title: "Text Copied!",
      description: "Media kit summary has been copied to clipboard.",
    });
  };

  const handleRefresh = async () => {
    await refreshData();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated.",
    });
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {format(new Date(data.lastUpdated), "PPp")}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <AdminPanel />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Summary
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            
            <Button
              size="sm"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;
