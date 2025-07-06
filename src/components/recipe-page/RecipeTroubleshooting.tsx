import { Card } from '@/components/ui/card';

interface TroubleshootingItem {
  issue: string;
  cause: string;
  solution: string;
}

interface RecipeTroubleshootingProps {
  troubleshooting: TroubleshootingItem[];
}

export const RecipeTroubleshooting = ({ troubleshooting }: RecipeTroubleshootingProps) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Troubleshooting & Common Mistakes</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-semibold">Issue</th>
              <th className="text-left py-2 px-2 font-semibold">Cause</th>
              <th className="text-left py-2 px-2 font-semibold">Solution</th>
            </tr>
          </thead>
          <tbody>
            {troubleshooting.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-2 font-medium">{item.issue}</td>
                <td className="py-3 px-2">{item.cause}</td>
                <td className="py-3 px-2">{item.solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};