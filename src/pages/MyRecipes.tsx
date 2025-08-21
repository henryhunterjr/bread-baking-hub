import { Helmet } from 'react-helmet-async';
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
    <>
      <Helmet>
        <title>My Recipes - Personal Collection | Baking Great Bread at Home</title>
        <meta name="description" content="Your personal recipe collection and workspace. Save, organize, and create all your favorite bread recipes in one secure location." />
        <link rel="canonical" href="https://the-bakers-bench.lovable.app/my-recipes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My Recipes - Personal Collection | Baking Great Bread at Home" />
        <meta property="og:description" content="Your personal recipe collection and workspace. Save, organize, and create all your favorite bread recipes in one secure location." />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/my-recipes" />
        <meta property="og:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="My Recipes - Personal recipe collection and workspace" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Recipes - Personal Collection | Baking Great Bread at Home" />
        <meta name="twitter:description" content="Your personal recipe collection and workspace. Save, organize, and create all your favorite bread recipes in one secure location." />
        <meta name="twitter:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png" />
        <meta name="twitter:image:alt" content="My Recipes - Personal recipe collection and workspace" />
      </Helmet>
      
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
    </>
  );
};

export default MyRecipes;