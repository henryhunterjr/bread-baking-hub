import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { validateHookContext } from '@/utils/provider-validation';

interface ChatContextType {
  isMounted: boolean;
  mount: () => void;
}

const ChatContext = createContext<ChatContextType>({
  isMounted: false,
  mount: () => {}
});

export const useChatProvider = () => {
  const context = useContext(ChatContext);
  return validateHookContext('useChatProvider', context);
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  // More aggressive React availability check
  const ReactInstance = (globalThis as any).React || React;
  
  if (!ReactInstance || typeof ReactInstance.useRef !== 'function') {
    if (import.meta.env.DEV) {
      console.warn('ChatProvider: React hooks not available, rendering children without chat functionality');
    }
    return <>{children}</>;
  }

  try {
    const mountedRef = ReactInstance.useRef(false);

    const mount = () => {
      if (mountedRef.current) {
        if (import.meta.env.DEV) {
          console.warn('Chat widget attempted to mount multiple times. Ignoring additional mount attempts.');
        }
        return;
      }
      mountedRef.current = true;
    };

    const value: ChatContextType = {
      isMounted: mountedRef.current,
      mount
    };

    return (
      <ChatContext.Provider value={value}>
        {children}
      </ChatContext.Provider>
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('ChatProvider: Failed to initialize chat functionality:', error);
    }
    return <>{children}</>;
  }
};