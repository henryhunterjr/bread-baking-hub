import { createContext, useContext, useState, ReactNode } from "react";

interface MediaKitData {
  hero: {
    totalReach: number;
    monthlyImpressions: number;
    newsletterSubscribers: number;
    aboutText: string;
  };
  platforms: {
    facebookGroup: number;
    facebookPage: number;
    website: number;
    newsletter: number;
    blog: number;
  };
  lastUpdated: string;
}

interface SectionVisibility {
  hero: boolean;
  platforms: boolean;
  growth: boolean;
  audience: boolean;
  topContent: boolean;
  partners: boolean;
  benefits: boolean;
  contact: boolean;
}

interface MediaKitContextType {
  data: MediaKitData;
  updateData: (newData: Partial<MediaKitData>) => void;
  refreshData: () => Promise<void>;
  sectionVisibility: SectionVisibility;
  toggleSection: (section: keyof SectionVisibility) => void;
  isEditMode: boolean;
  setIsEditMode: (enabled: boolean) => void;
}

const MediaKitContext = createContext<MediaKitContextType | undefined>(undefined);

export const MediaKitProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<MediaKitData>({
    hero: {
      totalReach: 48315,
      monthlyImpressions: 729,
      newsletterSubscribers: 2400,
      aboutText: "Henry Hunter is an artisan baker, author, and community leader teaching home bakers to master bread-making, build community, and partner with brands who share our values of quality, authenticity, and education.",
    },
    platforms: {
      facebookGroup: 31000,
      facebookPage: 17315,
      website: 282,
      newsletter: 2400,
      blog: 729,
    },
    lastUpdated: new Date().toISOString(),
  });

  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    hero: true,
    platforms: true,
    growth: true,
    audience: true,
    topContent: true,
    partners: true,
    benefits: true,
    contact: true,
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const updateData = (newData: Partial<MediaKitData>) => {
    setData(prev => ({
      ...prev,
      ...newData,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const refreshData = async () => {
    console.log("Refreshing media kit data...");
    setData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const toggleSection = (section: keyof SectionVisibility) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <MediaKitContext.Provider value={{ 
      data, 
      updateData, 
      refreshData,
      sectionVisibility,
      toggleSection,
      isEditMode,
      setIsEditMode,
    }}>
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
