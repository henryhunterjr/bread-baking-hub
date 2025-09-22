import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Safe wrapper for TooltipProvider that handles React availability issues
const SafeTooltipProvider = ({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  // More aggressive React availability check
  const ReactCheck = (globalThis as any).React || React;
  
  if (!ReactCheck || !ReactCheck.useState || !ReactCheck.useEffect) {
    console.warn('React hooks not available, rendering children without tooltip functionality');
    return <>{children}</>;
  }

  // Additional runtime check
  try {
    // Test that React hooks work in this context
    const testState = ReactCheck.useState;
    if (typeof testState !== 'function') {
      console.warn('React useState is not a function, skipping TooltipProvider');
      return <>{children}</>;
    }
  } catch (error) {
    console.warn('React hooks test failed, falling back:', error);
    return <>{children}</>;
  }

  try {
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.warn('TooltipProvider failed to render, falling back to children only:', error);
    return <>{children}</>;
  }
};

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  // Check if React is available before rendering
  if (!React || !React.forwardRef) {
    return null;
  }

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, SafeTooltipProvider as TooltipProvider }