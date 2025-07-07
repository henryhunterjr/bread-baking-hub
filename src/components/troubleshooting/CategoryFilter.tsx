import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { CategoryFilterProps } from '@/types/crustAndCrumb';

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-4 lg:grid-cols-6 scrollbar-hide">
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange('all')}
              className="whitespace-nowrap flex-shrink-0 bg-amber-100 hover:bg-amber-200 text-stone-800 border-amber-300 touch-manipulation min-h-[44px]"
            >
              All Issues
            </Button>
          </motion.div>
          {categories.map((category) => (
            <motion.div
              key={category}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className="whitespace-nowrap flex-shrink-0 bg-amber-100 hover:bg-amber-200 text-stone-800 border-amber-300 touch-manipulation min-h-[44px]"
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;