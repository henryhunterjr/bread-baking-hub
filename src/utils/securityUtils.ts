import { supabase } from '@/integrations/supabase/client'

// Enhanced input validation
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 255
  },
  
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain letters')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain numbers')
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters')
    }
    
    return { valid: errors.length === 0, errors }
  },
  
  text: (text: string, maxLength = 1000): boolean => {
    return typeof text === 'string' && 
           text.length <= maxLength && 
           !/[<>\"'&]/.test(text) // Basic XSS prevention
  },
  
  slug: (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug) && slug.length <= 100
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }
}

// Rate limiting helper
export const checkRateLimit = async (endpoint: string): Promise<boolean> => {
  try {
    const identifier = localStorage.getItem('device-id') || 
                      crypto.randomUUID()
    
    if (!localStorage.getItem('device-id')) {
      localStorage.setItem('device-id', identifier)
    }
    
    const { data, error } = await supabase.functions.invoke('rate-limiter', {
      body: { endpoint, identifier }
    })
    
    if (error) {
      console.warn('Rate limit check failed:', error)
      return true // Allow on error to not block users
    }
    
    return data?.allowed || false
  } catch (error) {
    console.warn('Rate limit error:', error)
    return true // Allow on error
  }
}

// Security event logging
export const logSecurityEvent = async (
  eventType: string, 
  userId?: string, 
  eventData?: Record<string, any>
): Promise<void> => {
  try {
    await supabase.functions.invoke('security-audit', {
      body: {
        event_type: eventType,
        user_id: userId,
        event_data: eventData
      }
    })
  } catch (error) {
    console.warn('Security logging failed:', error)
  }
}

// Enhanced form sanitization
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove potential XSS vectors
      sanitized[key] = value
        .replace(/[<>\"'&]/g, '')
        .trim()
        .slice(0, 1000) // Limit length
    } else if (typeof value === 'number') {
      sanitized[key] = Number.isFinite(value) ? value : 0
    } else if (typeof value === 'boolean') {
      sanitized[key] = Boolean(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value
        .filter(item => typeof item === 'string')
        .map(item => item.replace(/[<>\"'&]/g, '').trim())
        .slice(0, 10) // Limit array size
    }
  }
  
  return sanitized
}