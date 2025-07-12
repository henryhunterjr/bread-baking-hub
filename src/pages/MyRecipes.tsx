import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComingSoonBlock from '@/components/ComingSoonBlock';

const MyRecipes = () => {
  const featureList = [
    "Save and organize your personal recipe collection",
    "Upload family recipes from PDFs or photos", 
    "Create and edit custom recipes with our workspace",
    "Save favorite blog posts and recipes to your collection",
    "Private, secure storage - only you can see your recipes",
    "Smart tagging and folder organization",
    "AI-powered recipe assistance from Crusty"
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="pt-20">
        <ComingSoonBlock 
          title="My Recipes"
          description="Your personal recipe collection and workspace is coming soon! This will be your hub for saving, organizing, and creating all your favorite bread recipes."
          subtitle=""
          featureList={featureList}
          showNavigation={true}
          showNotifyButton={false}
          backgroundImage="/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png"
        />
      </main>
      <Footer />
    </div>
  );
};

export default MyRecipes;