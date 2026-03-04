import { Card, CardHeader, CardTitle, CardContent, lang } from "@/core/libs";
import { Users2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAlert } from "@/features/_global/hooks";
import { useProfile } from "@/features/profile";

// Placeholder service (replace with actual implementation)
const statsService = {
  getLocationStats: async ({ sekolahId }: { sekolahId?: number }) => {
    // Mock API response
    return {
      data: [
        { country: "Indonesia", flag: "🇮🇩", visitors: 3551, percentage: 30 },
        { country: "Vietnam", flag: "🇻🇳", visitors: 2951, percentage: 20 },
        { country: "United States", flag: "🇺🇸", visitors: 2125, percentage: 15 },
      ],
    };
  },
};

interface LocationStat {
  country: string;
  flag: string;
  visitors: number;
  percentage: number;
}

export const TopLocationCard = () => {
  const { user } = useProfile();
  const alert = useAlert();
  const [locations, setLocations] = useState<LocationStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await statsService.getLocationStats({ sekolahId: user?.sekolah?.id });
        setLocations(response.data);
        setError(null);
      } catch (err) {
        console.error("❌ Failed fetching location stats:", err);
        setError(lang.text('errorFetchLocations') || "Failed to fetch location statistics");
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.sekolah?.id) {
      fetchLocations();
    } else {
      setError(lang.text('noReport') || "School ID not available");
      setIsLoading(false);
    }
  }, [user?.sekolah?.id]);

  return (
    <Card className="bg-white dark:bg-theme-color-primary/5 p-6 rounded-xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          {lang.text("topStudentLocation") || "Top Student Location"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        ) : locations.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No locations available</div>
        ) : (
          <div className="space-y-4">
            {locations.map((loc, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center mb-1 gap-2 text-sm text-black dark:text-gray-200">
                    <span className="text-xl">{loc.flag}</span>
                    <span>{loc.country}</span>
                  </div>
                  <div className="relative w-full h-8 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full px-3 flex items-center justify-between text-sm text-black dark:text-gray-200 font-medium"
                      style={{
                        width: `${loc.percentage}%`,
                        background: "linear-gradient(to right, #FFFFFF, #CCEABB)",
                      }}
                    >
                      <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <Users2 className="w-4 h-4" />
                        {loc.visitors.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium w-12 text-right">
                  {loc.percentage}%
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};