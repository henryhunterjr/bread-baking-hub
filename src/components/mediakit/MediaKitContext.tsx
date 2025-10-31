import { createContext, useContext, useState, ReactNode } from "react";

interface MediaKitData {
  hero: {
    totalReach: number;
    monthlyImpressions: number;
    newsletterSubscribers: number;
    aboutText: string;
  };
  lastUpdated: string;
}

interface MediaKitContextType {
  data: MediaKitData;
  updateData: (newData: Partial<MediaKitData>) => void;
  refreshData: () => Promise<void>;
}

const MediaKitContext = createContext<MediaKitContextType | undefined>(undefined);

export const MediaKitProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<MediaKitData>({
    hero: {
      totalReach: 48315,
      monthlyImpressions: 729, // From analytics
      newsletterSubscribers: 2400,
      aboutText: "Henry Hunter is an artisan baker, author, and community leader teaching home bakers to master bread-making, build community, and partner with brands who share our values of quality, authenticity, and education.",
    },
    lastUpdated: new Date().toISOString(),
  });

  const updateData = (newData: Partial<MediaKitData>) => {
    setData(prev => ({
      ...prev,
      ...newData,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const refreshData = async () => {
    // TODO: Fetch latest analytics data from API
    console.log("Refreshing media kit data...");
    setData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
    }));
  };

  return (
    <MediaKitContext.Provider value={{ data, updateData, refreshData }}>
      {children}
    </MediaKitContext.Provider>
  );
};

export const useMediaKit = () => {
  const context = useContext(MediaKitContext);
  if (!context) {
    throw new Error("useMediaKit must be used within MediaKitProvider");
  }
  return context;
};
