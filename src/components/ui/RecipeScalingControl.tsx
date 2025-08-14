import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface RecipeScalingControlProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  className?: string;
}

export const RecipeScalingControl: React.FC<RecipeScalingControlProps> = ({
  scale,
  onScaleChange,
  className = ''
}) => {
  const presetScales = [0.5, 1, 2, 3];
  
  const handleInputChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0.5 && numValue <= 3) {
      onScaleChange(numValue);
    }
  };

  const handleDecrement = () => {
    const newScale = Math.max(0.5, Math.round((scale - 0.5) * 10) / 10);
    onScaleChange(newScale);
  };

  const handleIncrement = () => {
    const newScale = Math.min(3, Math.round((scale + 0.5) * 10) / 10);
    onScaleChange(newScale);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Adjust servings:
      </span>
      
      {/* Preset chips */}
      <div className="flex gap-1">
        {presetScales.map((presetScale) => (
          <Button
            key={presetScale}
            variant={scale === presetScale ? 'hero' : 'outline'}
            size="sm"
            className="h-11 min-w-[44px] px-3 touch-manipulation"
            onClick={() => onScaleChange(presetScale)}
            aria-pressed={scale === presetScale}
            aria-label={`Scale recipe to ${presetScale}x`}
            tabIndex={0}
          >
            {presetScale}x
          </Button>
        ))}
      </div>

      {/* Custom input with +/- controls */}
      <div className="flex items-center border rounded-md bg-background">
        <Button
          variant="ghost"
          size="sm"
          className="h-11 w-11 px-0 rounded-r-none border-r touch-manipulation"
          onClick={handleDecrement}
          disabled={scale <= 0.5}
          aria-label="Decrease scale"
          tabIndex={0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          type="number"
          value={scale}
          onChange={(e) => handleInputChange(e.target.value)}
          min="0.5"
          max="3"
          step="0.1"
          className="h-11 w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          aria-label="Custom scale factor"
        />
        
        <Button
          variant="ghost"
          size="sm"
          className="h-11 w-11 px-0 rounded-l-none border-l touch-manipulation"
          onClick={handleIncrement}
          disabled={scale >= 3}
          aria-label="Increase scale"
          tabIndex={0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        (0.5x - 3x)
      </span>
    </div>
  );
};