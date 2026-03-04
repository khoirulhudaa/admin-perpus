import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { Card, CardContent, CardHeader, CardTitle, lang } from "@/core/libs";
import { BarChart2 } from "lucide-react";
import { useBookStats } from "../hooks";

export const BooksAmountBox = () => {
  const { user } = useProfile();
  const sekolahId = user?.sekolah?.id;
  const school = useSchoolDetail({ id: sekolahId || 1 });
  const server = school?.data?.serverPerpustakaan;

  const { data: stats, isLoading, error } = useBookStats(server, sekolahId);

  return (
    <Card className="bg-white dark:bg-theme-color-primary/5">
      <CardHeader>
        <CardTitle className="w-full flex items-center justify-between">
          {lang.text("booksAmount") || "Books Amount"}
          <BarChart2 />
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white dark:bg-theme-color-primary/5">
        {isLoading ? (
          <div className="mt-4 text-center text-gray-600 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">{`${error}`}</div>
        ) : !stats ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No data available</div>
        ) : (
          <>
            <div className="flex gap-10 mt-3 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="text-xs">{lang.text("booksAmount") || "Books Amount"}</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {stats.totalBooks.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs">{lang.text("borrowing") || "Borrowing"}</p>
                <p className="text-2xl text-orange-400 dark:text-orange-300 font-semibold">
                  {stats.borrowing}
                </p>
              </div>
              <div>
                <p className="text-xs">{lang.text("returned") || "Returned"}</p>
                <p className="text-2xl text-gray-800 dark:text-gray-200 font-semibold">
                  {stats.returned}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-theme-color-primary/5 px-5 py-4 mt-4 flex items-center justify-between rounded-b-[20px]">
              <div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {lang.text("available") || "Available"}
                </p>
                <p className="text-2xl font-semibold text-green-400 dark:text-green-300">
                  {stats.available}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
