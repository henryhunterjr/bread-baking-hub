import { ReactNode } from 'react';
import { sanitizeHtml } from '@/utils/sanitize';

interface SecureContentProps {
  content: string;
  children?: ReactNode;
  allowedTags?: string[];
  className?: string;
}

/**
 * SecureContent component that sanitizes HTML content to prevent XSS attacks
 * Use this component instead of dangerouslySetInnerHTML when rendering user content
 */
export const SecureContent = ({ 
  content, 
  children, 
  allowedTags,
  className 
}: SecureContentProps) => {
  const sanitizedContent = sanitizeHtml(content, {
    ALLOWED_TAGS: allowedTags || ['b', 'i', 'em', 'strong', 'p', 'ul', 'li', 'a', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
  });

  if (children) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};