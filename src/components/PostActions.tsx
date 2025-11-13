import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Printer, FileDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface PostActionsProps {
  title: string;
  content: string | HTMLElement;
  slug?: string;
  type?: 'blog' | 'recipe' | 'newsletter';
  className?: string;
}

export const PostActions = ({ 
  title, 
  content, 
  slug, 
  type = 'blog',
  className = '' 
}: PostActionsProps) => {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = () => {
    // For recipes with slugs, use dedicated print page
    if (type === 'recipe' && slug) {
      window.open(`/print/${slug}`, '_blank', 'noopener');
      toast({
        title: "Print Page Opened",
        description: "Print page opened in new tab",
      });
      return;
    }

    // For other content, trigger browser print
    window.print();
    
    toast({
      title: "Print Ready",
      description: "Use your browser's print dialog to print or save as PDF",
    });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Get the content element to convert
      let element: HTMLElement;
      
      if (typeof content === 'string') {
        // Create a temporary element with the content
        element = document.createElement('div');
        element.innerHTML = content;
        element.className = 'pdf-content';
        document.body.appendChild(element);
      } else {
        element = content;
      }

      // Find the main content area if we're converting the whole page
      const contentElement = element.querySelector('.blog-content, .prose, article, main') as HTMLElement || element;

      // Clone the content to avoid modifying the original
      const clonedContent = contentElement.cloneNode(true) as HTMLElement;
      
      // Remove buttons, navigation, and other non-content elements
      const elementsToRemove = clonedContent.querySelectorAll('button, nav, .print-hide, [data-print-hide]');
      elementsToRemove.forEach(el => el.remove());

      // Create wrapper with styling
      const wrapper = document.createElement('div');
      wrapper.style.padding = '40px';
      wrapper.style.maxWidth = '800px';
      wrapper.style.margin = '0 auto';
      wrapper.style.background = '#ffffff';
      wrapper.style.color = '#000000';
      wrapper.style.fontFamily = 'Georgia, serif';
      
      // Add logo and header
      const header = document.createElement('div');
      header.style.marginBottom = '30px';
      header.style.paddingBottom = '20px';
      header.style.borderBottom = '2px solid #E0B243';
      header.innerHTML = `
        <div style="text-align: center;">
          <h1 style="margin: 0 0 10px 0; color: #2A1A0C; font-size: 28px;">${title}</h1>
          <p style="margin: 0; color: #666; font-size: 14px;">bakinggreadbreadathome.com</p>
        </div>
      `;
      
      wrapper.appendChild(header);
      wrapper.appendChild(clonedContent);
      
      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '40px';
      footer.style.paddingTop = '20px';
      footer.style.borderTop = '1px solid #ddd';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.style.color = '#666';
      footer.innerHTML = `
        <p>© ${new Date().getFullYear()} Baking Great Bread At Home | bakinggreadbreadathome.com</p>
      `;
      
      wrapper.appendChild(footer);

      // Configure PDF options
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      await html2pdf().set(opt).from(wrapper).save();

      // Clean up temporary element if we created one
      if (typeof content === 'string') {
        document.body.removeChild(element);
      }

      toast({
        title: "PDF Downloaded",
        description: `${title} has been saved as a PDF`,
      });

    } catch (error) {
      console.error('PDF generation failed:', error);
      
      toast({
        title: "PDF Generation Failed",
        description: "Please try using the print button instead",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        variant="outline"
        size="default"
        className="gap-2"
        aria-label="Download as PDF"
      >
        <FileDown className="h-4 w-4" />
        {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
      </Button>
      
      <Button
        onClick={handlePrint}
        variant="outline"
        size="default"
        className="gap-2"
        aria-label="Print"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
};

export default PostActions;
