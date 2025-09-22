// Provider validation utilities to prevent invalid hook calls

export const validateReactComponent = (component: any, name: string): boolean => {
  if (typeof component !== 'function') {
    console.error(`${name} is not a valid React component function`);
    return false;
  }
  
  // Additional check for React elements vs function calls
  if (component.length > 1) {
    console.warn(`${name} appears to take multiple arguments - ensure it's used as JSX <${name}> not ${name}()`);
  }
  
  return true;
};

export const ensureSingleReactInstance = () => {
  const reactInstances = [];
  
  if ((globalThis as any).React) reactInstances.push('globalThis.React');
  if (typeof window !== 'undefined' && (window as any).React) reactInstances.push('window.React');
  if (typeof global !== 'undefined' && (global as any).React) reactInstances.push('global.React');
  
  if (reactInstances.length === 0) {
    console.error('No React instance found globally');
    return false;
  }
  
  if (reactInstances.length > 1) {
    console.warn('Multiple React instances detected:', reactInstances);
  }
  
  return true;
};

export const validateHookContext = (hookName: string, contextValue: any) => {
  if (contextValue === undefined) {
    throw new Error(
      `${hookName} must be used within a Provider. ` +
      'Ensure the component is wrapped in the appropriate Provider and ' +
      'the Provider is rendered as JSX: <Provider>children</Provider>, ' +
      'not called as a function: Provider(children)'
    );
  }
  return contextValue;
};