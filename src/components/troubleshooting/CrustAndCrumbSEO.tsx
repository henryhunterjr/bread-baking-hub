import React from 'react';
import { Helmet } from 'react-helmet-async';

const CrustAndCrumbSEO: React.FC = () => {
  return (
    <Helmet>
      <title>Crust & Crumb | Troubleshooting Bread Baking Made Simple</title>
      <meta 
        name="description" 
        content="Professional bread troubleshooting tool with step-by-step diagnosis. Solve sourdough, yeasted, and quick bread problems with expert guidance and visual examples." 
      />
      <meta name="keywords" content="bread troubleshooting, sourdough problems, bread baking help, crust and crumb, bread diagnosis" />
      <link rel="canonical" href="https://bread-baking-hub.vercel.app/crust-and-crumb" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bread-baking-hub.vercel.app/crust-and-crumb" />
      <meta property="og:title" content="Crust & Crumb | Troubleshooting Bread Baking Made Simple" />
      <meta 
        property="og:description" 
        content="Professional bread troubleshooting tool with step-by-step diagnosis. Solve sourdough, yeasted, and quick bread problems with expert guidance." 
      />
      <meta property="og:image" content="/lovable-uploads/3850aa1b-5d06-48a3-91c7-d9405d23ea7a.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://bread-baking-hub.vercel.app/crust-and-crumb" />
      <meta property="twitter:title" content="Crust & Crumb | Troubleshooting Bread Baking Made Simple" />
      <meta 
        property="twitter:description" 
        content="Professional bread troubleshooting tool with step-by-step diagnosis. Solve bread problems with expert guidance." 
      />
      <meta property="twitter:image" content="/lovable-uploads/3850aa1b-5d06-48a3-91c7-d9405d23ea7a.png" />

      {/* Additional meta tags for mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#D97706" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Crust & Crumb" />
      
      {/* PWA preparation */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/png" sizes="32x32" href="/lovable-uploads/3850aa1b-5d06-48a3-91c7-d9405d23ea7a.png" />
      <link rel="apple-touch-icon" href="/lovable-uploads/3850aa1b-5d06-48a3-91c7-d9405d23ea7a.png" />
    </Helmet>
  );
};

export default CrustAndCrumbSEO;