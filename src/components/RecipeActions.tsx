import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Printer, Download, Mail, Share } from 'lucide-react';
import { ImprovedShareModal } from '@/components/ImprovedShareModal';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handlePrint = () => {
    // Use dedicated print page if recipe has a slug
    if (recipe.slug) {
      window.open(`/print/${recipe.slug}`, '_blank', 'noopener');
      toast({
        title: "Print Page Opened",
        description: "Print page opened in new tab",
      });
      return;
    }

    // Fallback to inline print for recipes without slugs
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
    const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
    const fallback = async () => {
      try {
        const text = generateEmailBody(recipe);
        const resp = await fetch('https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/export-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: recipe.title, text })
        });
        if (!resp.ok) throw new Error(`Server PDF failed (${resp.status})`);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast({ title: 'PDF Ready', description: 'Downloaded server-generated PDF.' });
      } catch (err) {
        console.error('Server PDF fallback failed:', err);
        toast({ title: 'Print to PDF', description: 'PDF blocked. Opening print — choose “Save as PDF”.' });
        try { handlePrint(); } catch {}
      }
    };

    try {
      // Use the print route for better PDF generation
      if (recipe.slug) {
        const printUrl = `/print/${recipe.slug}`;
        window.open(printUrl, '_blank', 'noopener');
        toast({ 
          title: 'PDF Ready', 
          description: 'Print page opened. Use your browser\'s print-to-PDF feature.' 
        });
        setIsGeneratingPDF(false);
        return;
      }
      
      if (inIframe) {
        await fallback();
        return;
      }

      const printContent = generatePrintableHTML(recipe);
      const element = document.createElement('div');
      element.innerHTML = printContent;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      document.body.appendChild(element);

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5] as number[],
        filename: `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(options).from(element).save();
      document.body.removeChild(element);
      toast({ title: 'PDF Downloaded', description: 'Recipe saved as PDF to your downloads' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      await fallback();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailRecipe = async () => {
    const subject = `Recipe: ${recipe.title}`;
    const baseUrl = 'https://bakinggreatbread.com';
    const recipeUrl = recipe.slug 
      ? `${baseUrl}/recipes/${recipe.slug}`
      : window.location.href;
    const bodyText = `I found this fantastic fall recipe!\n\nCheck out the ${recipe.title} here: ${recipeUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    // Try opening email client directly
    try {
      window.open(mailtoLink, '_self');
      toast({ 
        title: 'Email Recipe', 
        description: 'Your email client should open with the recipe details.' 
      });
      return;
    } catch (error) {
      console.error('Email client failed:', error);
    }

    // Fallback UI if email client doesn't work
    setMailtoHref(mailtoLink);
    setEmailContent(bodyText);
    setShowEmailFallback(true);
  };

  const handleShare = async () => {
    // Generate the correct URL for the individual recipe page
    const baseUrl = 'https://bakinggreatbread.com';
    const recipeUrl = recipe.slug 
      ? `${baseUrl}/recipes/${recipe.slug}` 
      : window.location.href;
    
    setShareUrl(recipeUrl);
    setShowShareModal(true);
  };

  return (
    <div className={`flex flex-wrap gap-2 no-print ${className}`}>
      <Button
        onClick={handleDownloadPDF}
        variant="outline"
        size="sm"
        disabled={isGeneratingPDF}
        className="flex items-center gap-2 h-11"
      >
        <Download className="h-4 w-4" />
        {isGeneratingPDF ? 'Generating...' : 'Save as PDF'}
      </Button>
      
      <Button
        onClick={handleEmailRecipe}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-11"
      >
        <Mail className="h-4 w-4" />
        Email Recipe
      </Button>
      
      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-11"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
      {showEmailFallback && (
        <div className="w-full mt-2 rounded-md border border-border p-3 bg-background animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Email fallback</span>
            <button className="text-xs underline" onClick={() => setShowEmailFallback(false)} aria-label="Close email fallback">Close</button>
          </div>
          <a href={mailtoHref} className="text-sm underline story-link" aria-label="Open your email client">Open email client</a>
          <textarea
            className="mt-2 w-full h-32 rounded-md border border-border bg-background p-2 text-sm"
            readOnly
            value={emailContent}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Email content"
          />
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" className="h-11" onClick={async () => { try { await navigator.clipboard.writeText(emailContent); toast({ title: 'Copied!', description: 'Email content copied.' }); } catch (_) {} }}>Copy</Button>
            <Button size="sm" variant="ghost" className="h-11" onClick={() => setShowEmailFallback(false)}>Done</Button>
          </div>
        </div>
      )}
      
      <ImprovedShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={recipe.title}
        url={shareUrl}
        description="Festive pumpkin sourdough tied with twine and finished with a cinnamon stick stem."
      />
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