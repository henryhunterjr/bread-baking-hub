const PartnerSection = () => {
  const partners = [
    {
      name: "Brød & Taylor",
      logo: "https://brodandtaylor.com/cdn/shop/files/B_T_Logo_300x.png",
      quote: "Products I personally use and recommend for perfect proofing.",
      url: "https://brodandtaylor.com",
    },
    {
      name: "Wire Monkey",
      logo: "https://wiremonkey.com/cdn/shop/files/WM-logoblack.png",
      quote: "Essential tools for every serious bread baker.",
      url: "https://wiremonkey.com",
    },
    {
      name: "SourHouse",
      logo: "https://sourhouse.com/cdn/shop/files/Sourhouse_Logo_Final-01.png",
      quote: "Quality ingredients that make a difference in every loaf.",
      url: "https://sourhouse.com",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All partners are products Henry personally uses and recommends to his community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <a 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mb-6"
              >
                <div className="h-20 flex items-center justify-center bg-white rounded-lg p-4">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </a>
              
              <blockquote className="text-sm text-muted-foreground italic border-l-4 border-primary pl-4">
                "{partner.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-foreground">
            <strong>Our Partnership Promise:</strong> We only work with brands we genuinely use and believe in. 
            Every recommendation is authentic and tested in our own kitchen.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
