import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export interface CustomBreadcrumbItem {
  label: string;
  url: string;
}

export interface CustomBreadcrumbsProps {
  items?: CustomBreadcrumbItem[];
}

export function CustomBreadcrumbs({ items = [] }: CustomBreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs text-blue-900 mb-4">
      <ol className="flex items-center text-blue-900 space-x-2 text-sm text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            <span className="sr-only text-blue-900">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.url} className="flex text-blue-900 items-center">
            <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
            {index === items.length - 1 ? (
              <p className="text-blue-900 font-bold uppercase" aria-current="page">
                {item.label}
              </p>
            ) : (
              <Link
                to={item.url}
                className="hover:text-foreground text-blue-900 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
