import { Card, CardContent, CardTitle, lang } from "@/core/libs";
import { useMemo } from "react";

interface StatCardProps {
  title: string;
  value: any;
  icon?: React.ReactNode;
  color?: string;
  type?: string;
}

export const StatCard = ({ title, value, icon, color = "#F97316", type='default' }: StatCardProps) => {
  // Convert hex color to rgba with 37.5% opacity (equivalent to #XXXXXX60)
  const backgroundColor = useMemo(() => {
    if (color.startsWith("#") && color.length === 7) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.375)`; // 0.375 ≈ 60/255
    }
    return `${color}60`; // Fallback to original behavior
  }, [color]);

  return (
    <Card
      className="bg-white dark:bg-theme-color-primary/5 rounded-xl"
      aria-label={`${title}: ${value}`}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm text-gray-500 dark:text-gray-400">
            {title || '-'}
          </CardTitle>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</h2>
            {
              type !== 'members' && (
                <p className="ml-2 mt-1 text-slate-400 text-[12px] font-normal">/ {lang.text('thisWeek')}</p>
              )
            }
          </div>
        </div>
        {icon && (
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{ backgroundColor, color }}
            role="img"
            aria-hidden={!icon}
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};