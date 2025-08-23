import { useLocation } from "react-router-dom";
import * as React from "react";

// Component to handle route-based cleanup, must be inside Router context
export const RouteCleanupHandler = () => {
  const location = useLocation();
  
  // Safety cleanup on route change to prevent stuck scroll lock
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything
};