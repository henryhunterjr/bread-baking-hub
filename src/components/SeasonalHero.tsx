import { motion } from 'framer-motion';
import { Season, getCurrentSeason, getSeasonalColors } from '@/hooks/useSeasonalRecipes';
import { Snowflake, Flower, Sun, Leaf } from 'lucide-react';

interface SeasonalHeroProps {
  selectedSeason: Season | 'All';
  onSeasonChange: (season: Season) => void;
  seasonCounts: Record<Season, number>;
}

const seasonIcons = {
  Winter: Snowflake,
  Spring: Flower,
  Summer: Sun,
  Fall: Leaf,
};

const seasonImages = {
  Winter: '/lovable-uploads/fbc2e9ef-cfd7-4c79-814a-17349ff220bf.png',
  Spring: '/lovable-uploads/826b7414-1078-48f6-9e85-5405d3286838.png',
  Summer: '/lovable-uploads/fbc2e9ef-cfd7-4c79-814a-17349ff220bf.png',
  Fall: '/lovable-uploads/826b7414-1078-48f6-9e85-5405d3286838.png',
};

export const SeasonalHero = ({ selectedSeason, onSeasonChange, seasonCounts }: SeasonalHeroProps) => {
  const currentSeason = getCurrentSeason();
  const seasons: Season[] = ['Winter', 'Spring', 'Summer', 'Fall'];

  return (
    <div className="relative h-96 overflow-hidden bg-gradient-to-br from-background to-muted">
      {/* Seasonal Panels */}
      <div className="absolute inset-0 flex">
        {seasons.map((season, index) => {
          const isCurrent = season === currentSeason;
          const isSelected = selectedSeason === season || selectedSeason === 'All';
          const colors = getSeasonalColors(season);
          const Icon = seasonIcons[season];
          
          // Panel width logic: current season gets 40%, others get 20%
          const panelWidth = selectedSeason === 'All' 
            ? (isCurrent ? '40%' : '20%')
            : (selectedSeason === season ? '100%' : '0%');

          return (
            <motion.div
              key={season}
              className="relative cursor-pointer transition-all duration-700 ease-in-out"
              style={{ 
                width: panelWidth,
                background: colors.background,
              }}
              onClick={() => onSeasonChange(season)}
              whileHover={{ scale: selectedSeason === 'All' ? 1.02 : 1 }}
            >
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${seasonImages[season]})`,
                  filter: 'blur(1px)',
                }}
              />
              
              {/* Seasonal Elements Overlay */}
              <div className="absolute inset-0">
                {/* Seasonal decorative elements */}
                {season === 'Winter' && (
                  <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      >
                        <Snowflake className="w-4 h-4 text-blue-200 opacity-60" />
                      </div>
                    ))}
                  </div>
                )}
                
                {season === 'Spring' && (
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-bounce"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      >
                        <Flower className="w-5 h-5 text-pink-300 opacity-70" />
                      </div>
                    ))}
                  </div>
                )}
                
                {season === 'Summer' && (
                  <div className="absolute inset-0">
                    <Sun className="absolute top-4 right-4 w-16 h-16 text-yellow-400 opacity-60 animate-spin" style={{ animationDuration: '20s' }} />
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-8 bg-yellow-200 opacity-40"
                        style={{
                          left: `${10 + (i * 15)}%`,
                          bottom: '0',
                          transform: 'rotate(2deg)',
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {season === 'Fall' && (
                  <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 60}%`,
                        }}
                        animate={{
                          y: [0, 20, 0],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Leaf className="w-4 h-4 text-orange-400 opacity-70" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                  <h3 className={`text-lg font-semibold mb-1 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    {season}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {seasonCounts[season]} recipes
                  </p>
                  {isCurrent && (
                    <div className="mt-2 px-3 py-1 bg-primary/20 rounded-full">
                      <span className="text-xs font-medium text-primary">Current Season</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Title Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center bg-background/80 backdrop-blur-sm rounded-lg p-8 border">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Recipes Collection
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A Journey Through the Seasons
          </motion.p>
          <motion.div 
            className="mt-4 text-lg font-medium text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Baking Great <span className="text-2xl">BREAD</span> at Home
          </motion.div>
        </div>
      </div>
    </div>
  );
};