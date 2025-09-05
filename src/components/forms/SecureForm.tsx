import { ReactNode, FormEvent } from 'react';
import { sanitizeFormData, validateInput } from '@/utils/securityUtils';
import { toast } from 'sonner';

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (sanitizedData: Record<string, any>) => Promise<void> | void;
  className?: string;
  validateEmail?: boolean;
  validateText?: boolean;
  maxLength?: number;
}

/**
 * SecureForm component that automatically sanitizes and validates form data
 * Use this component to wrap forms that handle user input
 */
export const SecureForm = ({ 
  children, 
  onSubmit, 
  className,
  validateEmail = false,
  validateText = true,
  maxLength = 1000
}: SecureFormProps) => {
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const rawData: Record<string, any> = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      rawData[key] = value;
    }
    
    // Validate input data
    const validationErrors: string[] = [];
    
    for (const [key, value] of Object.entries(rawData)) {
      if (typeof value === 'string') {
        if (key.toLowerCase().includes('email') && validateEmail) {
          if (!validateInput.email(value)) {
            validationErrors.push(`Invalid email format for ${key}`);
          }
        }
        
        if (validateText && !validateInput.text(value, maxLength)) {
          validationErrors.push(`Invalid text input for ${key}`);
        }
      }
    }
    
    if (validationErrors.length > 0) {
      toast.error('Validation failed: ' + validationErrors.join(', '));
      return;
    }
    
    // Sanitize form data
    const sanitizedData = sanitizeFormData(rawData);
    
    try {
      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Form submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};