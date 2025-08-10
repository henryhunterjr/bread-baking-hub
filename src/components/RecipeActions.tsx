import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Printer, Download, Mail, Share } from 'lucide-react';
import html2pdf from 'html2pdf.js';

type PrintableRecipeData = {
  ingredients: string[];
  method: string[];
  prepTime?: string;
  bakeTime?: string;
  yield?: string;
  difficulty?: string;
  equipment?: string[];
  notes?: string;
};

type PrintableRecipe = {
  title: string;
  data: PrintableRecipeData;
  slug?: string;
};

interface RecipeActionsProps {
  recipe: PrintableRecipe;
  className?: string;
}


export const RecipeActions = ({ recipe, className = "" }: RecipeActionsProps) => {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showEmailFallback, setShowEmailFallback] = useState(false);
  const [mailtoHref, setMailtoHref] = useState('');
  const [emailContent, setEmailContent] = useState('');

  const handlePrint = () => {
    const printContent = generatePrintableHTML(recipe);

    // Try popup window first
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      // Fallback: hidden iframe print (works in iframes/pop-up blocked contexts)
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(printContent);
        doc.close();
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        };
      }
    }

    toast({
      title: "Print Ready",
      description: "Recipe formatted for printing",
    });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const printContent = generatePrintableHTML(recipe);
      
      // Create a temporary element
      const element = document.createElement('div');
      element.innerHTML = printContent;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      document.body.appendChild(element);

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(options).from(element).save();
      
      document.body.removeChild(element);
      
      toast({
        title: "PDF Downloaded",
        description: "Recipe saved as PDF to your downloads",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Print to PDF',
        description: 'PDF blocked. Opening print — choose “Save as PDF”.',
      });
      try {
        handlePrint();
      } catch (e) {
        // noop
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailRecipe = async () => {
    const subject = `Recipe: ${recipe.title}`;
    const bodyText = generateEmailBody(recipe);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: recipe.title, text: bodyText, url: window.location.href });
        return;
      } catch (_) {
        // fall through to fallback UI
      }
    }

    setMailtoHref(mailtoLink);
    setEmailContent(bodyText);
    setShowEmailFallback(true);

    try {
      await navigator.clipboard.writeText(bodyText);
      toast({ title: 'Copied!', description: 'Email content copied. Paste into your mail app.' });
    } catch (err) {
      // ignore
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: url,
        });
        
        toast({
          title: "Recipe Shared",
          description: "Recipe shared successfully",
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Recipe link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Share Error",
          description: "Unable to share recipe link",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 no-print ${className}`}>
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Print Recipe
      </Button>
      
      <Button
        onClick={handleDownloadPDF}
        variant="outline"
        size="sm"
        disabled={isGeneratingPDF}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isGeneratingPDF ? 'Generating...' : 'Save as PDF'}
      </Button>
      
      <Button
        onClick={handleEmailRecipe}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Email Recipe
      </Button>
      
      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
      {showEmailFallback && (
        <div className="w-full mt-2 rounded-md border border-border p-3 bg-background">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Email fallback</span>
            <button className="text-xs underline" onClick={() => setShowEmailFallback(false)} aria-label="Close email fallback">Close</button>
          </div>
          <a href={mailtoHref} className="text-sm underline" aria-label="Open your email client">Open email client</a>
          <textarea
            className="mt-2 w-full h-32 rounded-md border border-border bg-background p-2 text-sm"
            readOnly
            value={emailContent}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Email content"
          />
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(emailContent); toast({ title: 'Copied!', description: 'Email content copied.' }); } catch (_) {} }}>Copy</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowEmailFallback(false)}>Done</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const generatePrintableHTML = (recipe: PrintableRecipe) => {
  const ingredients = recipe.data.ingredients.map((ing: string) => {
    const parts = ing.split(':');
    const name = parts[0]?.trim() || ing;
    const measurement = parts[1]?.trim() || '';
    return `<li><strong>${name}:</strong> ${measurement}</li>`;
  }).join('');

  const instructions = recipe.data.method.map((step: string, index: number) => {
    return `<li><strong>Step ${index + 1}:</strong> ${step}</li>`;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${recipe.title} - Recipe</title>
      <style>
        body { 
          font-family: 'Georgia', serif; 
          line-height: 1.6; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          color: #333;
        }
        h1 { 
          color: #8B4513; 
          border-bottom: 2px solid #8B4513; 
          padding-bottom: 10px; 
        }
        h2 { 
          color: #A0522D; 
          margin-top: 30px; 
        }
        .meta { 
          background: #f5f5f5; 
          padding: 15px; 
          border-radius: 5px; 
          margin: 20px 0; 
        }
        .meta-item { 
          display: inline-block; 
          margin-right: 20px; 
          margin-bottom: 5px; 
        }
        ul, ol { 
          padding-left: 20px; 
        }
        li { 
          margin-bottom: 8px; 
        }
        .notes { 
          background: #fffbf0; 
          border-left: 4px solid #D2691E; 
          padding: 15px; 
          margin: 20px 0; 
        }
        @media print {
          body { font-size: 12pt; }
          h1 { font-size: 18pt; }
          h2 { font-size: 14pt; }
        }
      </style>
    </head>
    <body>
      <h1>${recipe.title}</h1>
      
      <div class="meta">
        <div class="meta-item"><strong>Prep Time:</strong> ${recipe.data.prepTime || 'Not specified'}</div>
        <div class="meta-item"><strong>Bake Time:</strong> ${recipe.data.bakeTime || 'Not specified'}</div>
        <div class="meta-item"><strong>Yield:</strong> ${recipe.data.yield || 'Not specified'}</div>
        <div class="meta-item"><strong>Difficulty:</strong> ${recipe.data.difficulty || 'Not specified'}</div>
      </div>

      <h2>Ingredients</h2>
      <ul>${ingredients}</ul>

      <h2>Instructions</h2>
      <ol>${instructions}</ol>

      ${recipe.data.equipment ? `
        <h2>Equipment</h2>
        <ul>${recipe.data.equipment.map((item: string) => `<li>${item}</li>`).join('')}</ul>
      ` : ''}

      ${recipe.data.notes ? `
        <div class="notes">
          <h2>Baker's Notes</h2>
          <p>${recipe.data.notes}</p>
        </div>
      ` : ''}

      <p style="margin-top: 40px; text-align: center; font-style: italic; color: #666;">
        Recipe from BakingGreatBread.blog
      </p>
    </body>
    </html>
  `;
};

const generateEmailBody = (recipe: PrintableRecipe) => {
  const ingredients = recipe.data.ingredients.map((ing: string) => {
    const parts = ing.split(':');
    const name = parts[0]?.trim() || ing;
    const measurement = parts[1]?.trim() || '';
    return `• ${name}: ${measurement}`;
  }).join('\n');

  const instructions = recipe.data.method.map((step: string, index: number) => {
    return `${index + 1}. ${step}`;
  }).join('\n\n');

  return `${recipe.title}

Recipe Details:
• Prep Time: ${recipe.data.prepTime || 'Not specified'}
• Bake Time: ${recipe.data.bakeTime || 'Not specified'}
• Yield: ${recipe.data.yield || 'Not specified'}
• Difficulty: ${recipe.data.difficulty || 'Not specified'}

INGREDIENTS:
${ingredients}

INSTRUCTIONS:
${instructions}

${recipe.data.notes ? `BAKER'S NOTES:
${recipe.data.notes}` : ''}

Recipe from BakingGreatBread.blog
`;
};