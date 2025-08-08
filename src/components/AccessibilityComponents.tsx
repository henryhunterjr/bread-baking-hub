import { ReactNode } from 'react';

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

export const SkipLink = ({ href, children }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      tabIndex={0}
    >
      {children}
    </a>
  );
};

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const VisuallyHidden = ({ children, as: Component = 'span' }: VisuallyHiddenProps) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};

interface AccessibleButtonProps {
  children: ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AccessibleButton = ({
  children,
  onClick,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  className = '',
  type = 'button'
}: AccessibleButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

interface LandmarkProps {
  children: ReactNode;
  as?: 'header' | 'main' | 'aside' | 'footer' | 'nav' | 'section';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  id?: string;
}

export const Landmark = ({ 
  children, 
  as: Component = 'section', 
  ariaLabel, 
  ariaLabelledBy,
  id 
}: LandmarkProps) => {
  return (
    <Component
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
    >
      {children}
    </Component>
  );
};

// Hook for managing focus
export const useFocusManagement = () => {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  const trapFocus = (containerSelector: string) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { focusElement, trapFocus };
};