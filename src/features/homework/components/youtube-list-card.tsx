import { useEffect, useState } from "react";
import { Input, Button, Card, CardHeader, CardTitle, CardContent, Progress, lang } from "@/core/libs";
import { useSchoolCreation, useSchoolDetail } from "@/features/schools/hooks";
import { useProfile } from "@/features/profile";
import { useAlert } from "@/features/_global/hooks";

interface YoutubeFieldItem {
  key: keyof YoutubeFieldState;
  label: string;
}

interface YoutubeFieldState {
  urlYutubeFirst: string;
  urlYutubeSecond: string;
  urlYutubeThird: string;
  progressYutubeFirst?: number; // Optional progress for each URL
  progressYutubeSecond?: number;
  progressYutubeThird?: number;
}

export const YoutubeListCard = () => {
  const { user } = useProfile();
  const alert = useAlert();
  const schoolId = user?.sekolah?.id;
  const { data: schoolData, isLoading: isSchoolLoading } = useSchoolDetail({ id: schoolId });
  const { update, isLoading: isUpdateLoading } = useSchoolCreation();

  const [editing, setEditing] = useState<Partial<YoutubeFieldState>>({});
  const [formData, setFormData] = useState<YoutubeFieldState>({
    urlYutubeFirst: "",
    urlYutubeSecond: "",
    urlYutubeThird: "",
    progressYutubeFirst: 0,
    progressYutubeSecond: 0,
    progressYutubeThird: 0,
  });

  // Update formData when schoolData is available
  useEffect(() => {
    if (schoolData) {
      setFormData({
        urlYutubeFirst: schoolData.urlYutubeFirst || "",
        urlYutubeSecond: schoolData.urlYutubeSecond || "",
        urlYutubeThird: schoolData.urlYutubeThird || "",
        // Placeholder progress values (replace with actual data if available)
        progressYutubeFirst: schoolData.progressYutubeFirst || 59, // Example value
        progressYutubeSecond: schoolData.progressYutubeSecond || 87,
        progressYutubeThird: schoolData.progressYutubeThird || 70,
      });
    }
  }, [schoolData]);

  const fields: YoutubeFieldItem[] = [
    { key: "urlYutubeFirst", label: "YouTube URL 1" },
    { key: "urlYutubeSecond", label: "YouTube URL 2" },
    { key: "urlYutubeThird", label: "YouTube URL 3" },
  ];

  const handleChange = (key: keyof YoutubeFieldState, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: keyof YoutubeFieldState) => {
    if (!schoolId) {
      alert.error(lang.text("noSchoolId"));
      return;
    }
    try {
      await update(schoolId, { [key]: formData[key] });
      alert.success(
        lang.text("successful", {
          context: lang.text("updateUrlData"),
        })
      );
      setEditing((prev) => ({ ...prev, [key]: false }));
    } catch (err) {
      console.error("❌ Gagal update YouTube URL:", err);
      alert.error(lang.text("errorUpdateUrl"));
    }
  };

  return (
    <Card className="bg-white dark:bg-theme-color-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          {lang.text("addingYoutubeUrl")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSchoolLoading ? (
          <div className="text-center text-black dark:text-white">Loading...</div>
        ) : !schoolData ? (
          <div className="text-center text-black dark:text-white">No data available</div>
        ) : (
          fields.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-2 border-y border-white/10 py-[27.3px]">
              <div className="flex items-center gap-3 w-full">
                {editing[key] ? (
                  <>
                    <Input
                      value={formData[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={label}
                      className="flex-1 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <Button
                      size="sm"
                      disabled={isUpdateLoading}
                      onClick={() => handleSave(key)}
                      className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                      onClick={() => setEditing((prev) => ({ ...prev, [key]: true }))}
                    >
                      Edit
                    </Button>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{formData[key] || "No URL set"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};