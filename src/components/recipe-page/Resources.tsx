import { Card } from '@/components/ui/card';

interface ResourceLink {
  url: string;
  text: string;
  description: string;
  external?: boolean;
}

interface ResourcesProps {
  links: ResourceLink[];
}

export const Resources = ({ links }: ResourcesProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Links & Resources</h2>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            • <a 
              href={link.url} 
              className="text-primary hover:underline"
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.text}
            </a> – {link.description}
          </li>
        ))}
      </ul>
    </Card>
  );
};