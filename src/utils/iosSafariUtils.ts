// iOS Safari compatibility utilities
export const isIOSSafari = (): boolean => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  return isIOS && isSafari;
};

export const shareWithFallback = async (shareData: {
  title: string;
  text: string;
  url: string;
}): Promise<boolean> => {
  // Try native Web Share API first
  if (navigator.share && !isIOSSafari()) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // User cancelled or error occurred, fall through to fallback
    }
  }

  // Fallback: Copy to clipboard
  try {
    const textToShare = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToShare);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToShare;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return result;
    }
  } catch (error) {
    console.error('Share fallback failed:', error);
    return false;
  }
};

export const downloadPDFWithFallback = (
  element: HTMLElement,
  filename: string = 'recipe.pdf'
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Try modern PDF generation
      if (typeof window !== 'undefined' && 'html2pdf' in window) {
        const html2pdf = (window as any).html2pdf;
        
        const opt = {
          margin: 1,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
        resolve();
      } else {
        // Fallback: Print CSS styling
        throw new Error('PDF library not available');
      }
    } catch (error) {
      // iOS Safari fallback: Use print with CSS
      try {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Popup blocked');
        }

        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${filename}</title>
            <style>
              @media print {
                body { font-family: Arial, sans-serif; margin: 1in; }
                .no-print { display: none !important; }
                .print-only { display: block !important; }
                h1, h2, h3 { color: #2D5016; page-break-after: avoid; }
                ul, ol { page-break-inside: avoid; }
                img { max-width: 100%; height: auto; }
                .page-break { page-break-before: always; }
              }
              @media screen {
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                .print-only { display: none; }
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
            <div class="print-only" style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>Generated from Baking Great Bread - ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
          </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          resolve();
        }, 500);
        
      } catch (printError) {
        console.error('Print fallback failed:', printError);
        reject(new Error('PDF generation and print fallback both failed'));
      }
    }
  });
};

export const handlePopupBlocked = (callback: () => void, fallbackMessage: string) => {
  try {
    callback();
  } catch (error) {
    // Popup was likely blocked
    alert(`${fallbackMessage}\n\nPlease allow popups for this site to use this feature, or try using the share button instead.`);
  }
};

// Email sharing with iOS Safari compatibility
export const shareViaEmail = (subject: string, body: string): boolean => {
  try {
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    if (isIOSSafari()) {
      // iOS Safari: Use location.href for better compatibility
      window.location.href = emailUrl;
    } else {
      // Other browsers: Use window.open
      window.open(emailUrl, '_blank');
    }
    
    return true;
  } catch (error) {
    console.error('Email share failed:', error);
    return false;
  }
};

// Performance optimization for iOS Safari
export const optimizeForIOSSafari = () => {
  if (!isIOSSafari()) return;

  // Disable hover effects on touch devices
  const style = document.createElement('style');
  style.textContent = `
    @media (hover: none) and (pointer: coarse) {
      .hover\:scale-105:hover { transform: none !important; }
      .hover\:shadow-lg:hover { box-shadow: none !important; }
      .group:hover .group-hover\:scale-110 { transform: none !important; }
    }
  `;
  document.head.appendChild(style);

  // Optimize scroll performance
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', () => {}, { passive: true });
};

// Auto-initialize iOS Safari optimizations
if (typeof window !== 'undefined') {
  optimizeForIOSSafari();
}
