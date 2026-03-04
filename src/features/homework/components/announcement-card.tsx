import { Button, Card, CardContent, CardHeader, CardTitle, Input, lang } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { fetchCalendarEvents, updateCalendarEvent } from "@/features/events";
import dayjs from "dayjs";
import { BookOpenCheck, HelpCircle, Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../utils/truntText";

type EventItem = {
  id: number;
  note: string;
  description: string;
  startTime: string;
  endTime: string;
};

// Icon mapping for announcement types
const ICON_MAP = {
  announcement: <Megaphone className="text-white w-5 h-5" />,
  returnBook: <BookOpenCheck className="text-white w-5 h-5" />,
  help: <HelpCircle className="text-white w-5 h-5" />,
};

// Map event note to icon type (customize based on your logic)
const getIconType = (note: string): keyof typeof ICON_MAP => {
  const lowerNote = note.toLowerCase();
  if (lowerNote.includes("pengumuman")) return "announcement";
  if (lowerNote.includes("pengembalian") || lowerNote.includes("buku")) return "returnBook";
  if (lowerNote.includes("bantuan") || lowerNote.includes("hubungi")) return "help";
  return "announcement"; // Default fallback
};

export const AnnouncementCard = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [formData, setFormData] = useState<Record<number, Partial<EventItem>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetchCalendarEvents();
        const mapped = res.data.map((e: any) => ({
          id: e.id,
          note: e.note || "",
          description: e.description || "",
          startTime: e.startTime || "",
          endTime: e.endTime || "",
        }));
        setEvents(mapped);
        setError(null);
      } catch (err) {
        console.error("❌ Failed fetching events:", err);
        setError(lang.text('fail') || "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (id: number, field: keyof EventItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: number) => {
    const data = formData[id];
    if (!data) return;

    const updatePayload = new FormData();
    updatePayload.append("note", data.note || "");
    updatePayload.append("description", data.description || "");
    updatePayload.append(
      "startTime",
      data.startTime ? dayjs(data.startTime).toISOString() : ""
    );
    updatePayload.append(
      "endTime",
      data.endTime ? dayjs(data.endTime).toISOString() : ""
    );

    try {
      await updateCalendarEvent(id, updatePayload);
      alert.success(lang.text("successful", { context: lang.text("updateEvent") }) || "Event updated successfully!");
      setEditing((prev) => ({ ...prev, [id]: false }));
      // Refresh events after update
      const res = await fetchCalendarEvents();
      setEvents(
        res.data.map((e: any) => ({
          id: e.id,
          note: e.note || "",
          description: e.description || "",
          startTime: e.startTime || "",
          endTime: e.endTime || "",
        }))
      );
    } catch (err) {
      console.error("❌ Gagal update event:", err);
      alert.error(lang.text('fail') || "Failed to save event changes");
    }
  };

  return (
    <Card className="bg-white dark:bg-theme-color-primary/5 h-max">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          {lang.text("listActiveAnnouncement") || "List Active Announcements"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 grid grid-cols-1">
        {isLoading ? (
          <div className="text-center text-black dark:text-white">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-black dark:text-white">No announcements available</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="space-y-2 border-b border-white/10 pb-6">
              {editing[event.id] ? (
                <>
                  <Input
                    value={formData[event.id]?.note ?? event.note}
                    onChange={(e) => handleChange(event.id, "note", e.target.value)}
                    placeholder="Judul"
                    className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <Input
                    value={formData[event.id]?.description ?? event.description}
                    onChange={(e) => handleChange(event.id, "description", e.target.value)}
                    placeholder="Deskripsi"
                    className="text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="datetime-local"
                      value={formData[event.id]?.startTime ?? event.startTime}
                      onChange={(e) => handleChange(event.id, "startTime", e.target.value)}
                      className="text-black dark:text-white"
                    />
                    <Input
                      type="datetime-local"
                      value={formData[event.id]?.endTime ?? event.endTime}
                      onChange={(e) => handleChange(event.id, "endTime", e.target.value)}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(event.id)}
                    className="mt-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    aria-label="Save announcement"
                  >
                    Simpan
                  </Button>
                </>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-900 dark:bg-gray-800">
                    {ICON_MAP[getIconType(event.note)]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.note}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {truncateText(event.description, 80)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {dayjs(event.startTime).format("DD/MM/YYYY HH:mm")} -{" "}
                      {dayjs(event.endTime).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 text-xs font-medium"
                    onClick={() => navigate("/events")}
                    aria-label={`Edit announcement ${event.note}`}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};