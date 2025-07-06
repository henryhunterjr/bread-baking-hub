import { Card } from '@/components/ui/card';

export const RecipeResources = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Links & Resources</h2>
      <ul className="space-y-2">
        <li>• <a href="#" className="text-primary hover:underline">Sourdough Starter Guide</a> – Learn to keep your starter strong.</li>
        <li>• <a href="#" className="text-primary hover:underline">Brød & Taylor Baking Shell</a> – My favorite tool for consistent results.</li>
        <li>• <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join the Facebook Group</a> – Connect with thousands of bakers for tips and feedback!</li>
        <li>• <a href="#" className="text-primary hover:underline">My sourdough baking process</a></li>
      </ul>
    </Card>
  );
};