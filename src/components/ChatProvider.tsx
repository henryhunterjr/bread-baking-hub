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
  // Runtime guard to ensure React hooks are available
  if (!React || !React.useRef || !React.useContext) {
    if (import.meta.env.DEV) {
      console.warn('ChatProvider: React hooks not available, rendering children without chat functionality');
    }
    return <>{children}</>;
  }

  // Additional safety check for hook availability
  try {
    const mountedRef = useRef(false);

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