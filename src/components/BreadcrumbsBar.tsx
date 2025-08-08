import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const titleMap: Record<string, string> = {
  'recipes': 'Recipes',
  'my-recipes': 'My Recipes',
  'r': 'Recipe',
  'blog': 'Blog',
};

const BreadcrumbsBar = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  return (
    <div className="bg-muted/30 border-b">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {parts.map((part, idx) => {
              const href = '/' + parts.slice(0, idx + 1).join('/');
              const isLast = idx === parts.length - 1;
              const label = titleMap[part] || decodeURIComponent(part).replace(/-/g, ' ');
              return (
                <div key={href} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbsBar;
