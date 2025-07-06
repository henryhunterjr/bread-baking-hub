import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const RecipeMethod = () => {
  return (
    <Card className="p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">Method</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">1. Mix & Fermentolyse (10 minutes active, 45 minutes rest)</h3>
          <p className="text-muted-foreground mb-3">
            We're skipping the traditional autolyse and going straight to mixing everything upfront.
          </p>
          <ul className="space-y-2 ml-4">
            <li>• In a large bowl, mix flour, water, and sourdough starter until no dry flour remains. Cover and let the mixture rest for 45 minutes.</li>
            <li>• After resting, add the salt and mix by hand using the Rubaud method:</li>
            <li className="ml-4">◦ Cup your hand and scoop from underneath the dough.</li>
            <li className="ml-4">◦ Lift the dough upward, allowing it to fall back on itself.</li>
            <li className="ml-4">◦ Repeat for about 10 minutes until the dough looks smooth and holds its shape.</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3">2. Stretch & Fold (or Coil Fold) – 3 sets every 45 minutes</h3>
          <p className="text-muted-foreground mb-3">
            Building dough strength is essential, especially for high-hydration recipes like this one. Choose between stretch and folds or the gentler coil fold method:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Stretch & Fold:</h4>
              <p className="text-sm">Lift one side of the dough upward and fold it over itself. Rotate the bowl and repeat on all four sides.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Coil Fold:</h4>
              <ul className="text-sm space-y-1">
                <li>• Wet your hands to prevent sticking.</li>
                <li>• Gently lift the center of the dough with both hands.</li>
                <li>• Allow the dough to naturally coil under itself as you lift and fold.</li>
              </ul>
            </div>
          </div>
          <p className="mt-3">Perform 3 sets, with 45 minutes between each set. By the end, the dough should feel strong, elastic, and less sticky.</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3">3. Shape the Dough</h3>
          <p className="mb-3">After the final fold, let the dough rest in the bowl for 30 minutes, then shape it directly.</p>
          <ul className="space-y-2 ml-4">
            <li>• Turn the dough out onto a lightly floured surface, letting gravity help pull it out of the bowl.</li>
            <li>• Gently stretch the dough into a square without pressing out the gas.</li>
            <li>• Fold it like a letter:</li>
            <li className="ml-4">◦ Take the bottom edge and fold it up to the center.</li>
            <li className="ml-4">◦ Stretch the bottom corners outward and fold them inward to slightly overlap.</li>
            <li className="ml-4">◦ Take the top edge, stretch slightly, and fold it down towards the bottom to create a square bundle.</li>
            <li>• Place the shaped dough seam-side up in a floured proofing basket. Cover and let it rest on the counter for 1 hour, then refrigerate for 8–24 hours.</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3">4. Preheat & Score</h3>
          <ul className="space-y-2 ml-4">
            <li>• Preheat your oven to 475°F (245°C) with your baking vessel inside.</li>
            <li>• <strong>Pro Tip:</strong> If you plan intricate scoring, place the dough in the freezer for 15 minutes during the preheat. This firms up the surface, making it easier to score, especially in warm weather.</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3">5. Bake</h3>
          <ul className="space-y-2 ml-4">
            <li>• Remove the dough from the fridge, transfer it to a piece of parchment paper or bread sling, and score the top using a lame or sharp knife.</li>
            <li>• Using the parchment or sling, carefully lower the dough into the preheated baking vessel.</li>
            <li>• Bake:</li>
            <li className="ml-4">◦ Covered for 22 minutes.</li>
            <li className="ml-4">◦ Uncovered for 10–15 minutes, or until the crust is golden brown and the internal temperature reaches 200°F (93°C).</li>
            <li>• Let the loaf cool completely before slicing—it's worth the wait!</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};