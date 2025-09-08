// Share utilities for robust cross-platform recipe sharing

export interface ShareLinks {
  facebook: string;
  x: string;
  pinterest: string;
  email: string;
  gmail: string;
  copy: string;
}

export function getShareLinks({ url, title }: { url: string; title: string }): ShareLinks {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this recipe: ${encodedUrl}`,
    gmail: `https://mail.google.com/mail/?view=cm&su=${encodedTitle}&body=Check%20out%20this%20recipe:%20${encodedUrl}`,
    copy: url
  };
}

export function openShareLink(url: string, platform: string): void {
  if (platform === 'email' && url.startsWith('mailto:')) {
    window.location.href = url;
  } else if (platform === 'gmail') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function validateShareData(title?: string, url?: string): { isValid: boolean; message?: string } {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Recipe title is missing' };
  }
  
  if (!url || url.trim().length === 0) {
    return { isValid: false, message: 'Recipe URL is missing' };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Invalid recipe URL' };
  }
}