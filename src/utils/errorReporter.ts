import { supabase } from '@/integrations/supabase/client';

export interface ErrorReport {
  route: string;
  userId?: string;
  message: string;
  stack?: string;
  userAgent?: string;
  timestamp: string;
}

export const reportError = async (error: Error, context?: { route?: string; userId?: string }) => {
  try {
    // Hash user ID for privacy if provided
    const hashedUserId = context?.userId ? 
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(context.userId))
        .then(buffer => Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
        ) : undefined;

    const errorReport: ErrorReport = {
      route: context?.route || window.location.pathname,
      userId: hashedUserId,
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Log to Supabase
    const { error: dbError } = await supabase
      .from('error_logs')
      .insert({
        function_name: 'client_error',
        error_type: error.name || 'ClientError',
        error_message: error.message,
        error_stack: error.stack,
        request_payload: errorReport as any,
        timestamp: errorReport.timestamp,
        severity: 'error'
      });

    if (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error('Error reported:', errorReport);
    }
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};

export const reportFormatError = async (
  functionName: string, 
  error: Error, 
  payload?: any
) => {
  try {
    const errorData = {
      function_name: functionName,
      error_type: error.name || 'FormatError',
      error_message: error.message,
      error_stack: error.stack,
      request_payload: payload,
      timestamp: new Date().toISOString(),
      severity: 'error'
    };

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert(errorData as any);

    if (dbError) {
      console.error('Failed to log format error:', dbError);
    }

    if (import.meta.env.DEV) {
      console.error(`${functionName} error:`, errorData);
    }
  } catch (reportingError) {
    console.error('Failed to report format error:', reportingError);
  }
};