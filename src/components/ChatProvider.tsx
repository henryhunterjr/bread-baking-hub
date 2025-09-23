import React, { createContext, useContext, useRef, ReactNode } from 'react';

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
  if (context === undefined) {
    throw new Error('useChatProvider must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
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
};