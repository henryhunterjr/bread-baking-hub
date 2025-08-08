/**
 * Environment configuration for the application
 * Validates required environment variables at startup
 */

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config: AppConfig = {
  supabase: {
    url: validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    anonKey: validateEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Log configuration in development only
if (config.isDevelopment) {
  console.log('App configuration loaded:', {
    supabaseUrl: config.supabase.url,
    isDev: config.isDevelopment,
  });
}