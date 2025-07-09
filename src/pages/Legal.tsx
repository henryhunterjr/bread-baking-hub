import Header from "../components/Header";
import Footer from "../components/Footer";

const Legal = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Terms & Conditions */}
          <section>
            <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
            <p className="text-muted-foreground italic mb-8">Last updated: July 2025</p>
            
            <div className="prose prose-lg max-w-none">
              <p className="mb-6">
                Welcome to Baking Great Bread at Home ("we," "us," "our"). By using this website, you agree to the following terms and conditions. If you do not agree, please stop using the site.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Use of Content</h3>
                  <p>All content is for personal, non-commercial use only. You may not reproduce, distribute, or exploit any material without written permission.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. User Conduct</h3>
                  <p>You agree not to post offensive, illegal, or disruptive content. We reserve the right to remove any user-generated content at our discretion.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Disclaimers and Warranties</h3>
                  <p>All content is provided "as is." We make no guarantees about results. Use recipes and advice at your own risk.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Affiliate and Sponsorship Disclosure</h3>
                  <p>We use affiliate links. If you click a link and make a purchase, we may earn a commission at no extra cost to you.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Intellectual Property</h3>
                  <p>All original materials belong to Henry Hunter and Vitale Sourdough Co. They may not be used without permission.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. Limitation of Liability</h3>
                  <p>We are not liable for any damages resulting from your use of this site or its content. Our liability is limited to the fullest extent permitted by law.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">7. Governing Law</h3>
                  <p>These terms are governed by the laws of the State of South Carolina, United States.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">8. Changes</h3>
                  <p>We may update these terms at any time. Continued use of the site means you accept the changes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Affiliate Disclosure */}
          <section className="border-t pt-12">
            <h2 className="text-3xl font-bold mb-6">Affiliate Disclosure</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                We use affiliate links on this site. If you make a purchase through one of these links, we may receive a small commission at no extra cost to you. Your support helps us publish more recipes, build better tools, and serve our baking community.
              </p>
            </div>
          </section>

          {/* General Disclaimer */}
          <section className="border-t pt-12">
            <h2 className="text-3xl font-bold mb-6">General Disclaimer</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                The information on this site is for educational and informational purposes only. While we work hard to deliver accurate content, recipes, and advice, we make no guarantees about outcomes or results. Readers use this site and its information at their own risk.
              </p>
            </div>
          </section>

          {/* Copyright Notice */}
          <section className="border-t pt-12">
            <h2 className="text-3xl font-bold mb-6">Copyright Notice</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                © 2025 Henry Hunter. All rights reserved. Powered by Vitale Sourdough Co. and the Baking Great Bread at Home Facebook Group. Contact us at{' '}
                <a href="mailto:vitalesourdough@gmail.com" className="text-primary hover:underline">
                  vitalesourdough@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Legal;