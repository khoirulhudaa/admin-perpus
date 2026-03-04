import { useEffect, useState, useCallback } from "react";
import {
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEventById,
  updateCalendarEvent,
} from "../utils/api";
import Tesseract from "tesseract.js";
import { DashboardPageLayout, useAlert } from "@/features/_global";
import { Button, Input, lang, Textarea } from "@/core/libs";
import dayjs from "dayjs";
import { useProfile } from "@/features/profile";
import { EventTable } from "../components";

export interface Event {
  id: number;
  note: string;
  description: string;
  startTime: string;
  endTime: string;
  image?: string;
  video?: string;
}

export const CalendarEvent = () => {
  const { user } = useProfile();
  const alert = useAlert();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.id || null;
  const [userRole, setUserRole] = useState(user?.role?.toLowerCase());
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state for form submission

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role.toLowerCase());
    }
  }, [user]);

  const [formData, setFormData] = useState<{
    note: string;
    description: string;
    startTime: string;
    endTime: string;
    image: File | null;
    video: File | null;
    previewImage: string;
    previewVideo: string;
  }>({
    note: "",
    description: "",
    startTime: "",
    endTime: "",
    image: null,
    video: null,
    previewImage: "",
    previewVideo: "",
  });

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [selectedMonth] = useState(dayjs().format("YYYY-MM"));

  // Sync formData with editingEvent when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      // Format image for preview (handle base64 or URL)
      let formattedImage = editingEvent.image || "";
      if (formattedImage && formattedImage.startsWith("/9j/")) {
        formattedImage = `data:image/jpeg;base64,${formattedImage}`;
      } else if (
        formattedImage &&
        formattedImage.startsWith("iVBORw0KGgo")
      ) {
        formattedImage = `data:image/png;base64,${formattedImage}`;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        note: editingEvent.note || "",
        description: editingEvent.description || "",
        startTime: editingEvent.startTime
          ? dayjs(editingEvent.startTime).format("YYYY-MM-DDTHH:mm")
          : "",
        endTime: editingEvent.endTime
          ? dayjs(editingEvent.endTime).format("YYYY-MM-DDTHH:mm")
          : "",
        image: prevFormData.image, // Preserve user-selected image
        video: prevFormData.video, // Preserve user-selected video
        previewImage: prevFormData.image
          ? prevFormData.previewImage
          : formattedImage, // Preserve preview if image already selected
        previewVideo: prevFormData.video
          ? prevFormData.previewVideo
          : editingEvent.video || "",
      }));
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editingEvent]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetchCalendarEvents();

      if (!response || !response.data) {
        console.error("❌ Error: Data tidak ditemukan dalam response API.");
        return;
      }

      const formattedEvents: Event[] = response.data.map((event: any) => ({
        id: event.id ?? 0,
        note: event.note ?? "Tanpa Judul",
        description: event.description ?? "Tidak ada deskripsi",
        startTime: event.startTime ? dayjs(event.startTime).toISOString() : "",
        endTime: event.endTime ? dayjs(event.endTime).toISOString() : "",
        image: event.image || "",
        video: event.video || "",
      }));

      const now = dayjs();
      const expiredEvents = formattedEvents.filter((event: Event) =>
        event.endTime ? dayjs(event.endTime).isBefore(now) : false
      );

      if (expiredEvents.length > 0) {
        console.log(
          `🗑 Hapus ${expiredEvents.length} event yang sudah kadaluarsa...`
        );
        for (const event of expiredEvents) {
          if (event.id) {
            await handleDeleteEvent(event);
          }
        }
      }

      setEvents(formattedEvents.filter((event) => !expiredEvents.includes(event)));
    } catch (err) {
      console.error("❌ Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedMonth]);

  const handleCreateEvent = async () => {
    if (!user) {
      console.error("❌ User tidak ditemukan. Pastikan Anda sudah login.");
      alert.error("Anda harus login untuk membuat event.");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      console.error("❌ Waktu mulai dan selesai harus diisi.");
      alert.error("Waktu mulai dan selesai harus diisi.");
      return;
    }

    if (!formData.image) {
      console.error("❌ Gambar wajib diunggah.");
      alert.error("Gambar wajib diunggah!");
      return;
    }

    setIsSubmitting(true); // Start loading
    const userRole = user.role.toLowerCase();
    const userId = user.id;
    console.log(`🔑 Role pengguna dari useProfile: ${userRole}`);
    console.log(`🔎 User ID: ${userId}`);

    const newEvent = new FormData();
    newEvent.append("note", formData.note);
    newEvent.append("description", formData.description);
    newEvent.append("startTime", dayjs(formData.startTime).toISOString());
    newEvent.append("endTime", dayjs(formData.endTime).toISOString());
    newEvent.append("image", formData.image as File);
    if (formData.video) {
      newEvent.append("video", formData.video);
    }

    try {
      await createCalendarEvent(newEvent);
      alert.success("✅ Event berhasil dibuat!");
      resetForm();
      loadEvents();
    } catch (err) {
      console.error("❌ Error creating event:", err);
      alert.error("Gagal membuat event. Cek koneksi atau coba lagi.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;

    setIsSubmitting(true); // Start loading
    try {
      console.log(`📌 Fetching event by ID: ${editingEvent.id}`);
      const existingData = await fetchCalendarEventById(editingEvent.id);

      if (!existingData || !existingData.id) {
        console.warn(
          `⚠️ Event ID ${editingEvent.id} tidak ditemukan di server.`
        );
        alert.error(`Event dengan ID ${editingEvent.id} tidak ditemukan di server.`);
        setEditingEvent(null);
        loadEvents();
        return;
      }

      console.log("✅ Existing event data:", existingData);

      const startTime = formData.startTime
        ? dayjs(formData.startTime).toISOString()
        : existingData.startTime;

      const endTime = formData.endTime
        ? dayjs(formData.endTime).toISOString()
        : existingData.endTime;

      const updatedEvent = new FormData();
      updatedEvent.append("note", formData.note.trim() || existingData.note);
      updatedEvent.append(
        "description",
        formData.description.trim() || existingData.description
      );
      updatedEvent.append("startTime", startTime);
      updatedEvent.append("endTime", endTime);

      if (formData.image) {
        updatedEvent.append("image", formData.image);
      } else if (existingData.image) {
        // Preserve existing image if no new image is uploaded
        if (existingData.image.startsWith("/9j/")) {
          const byteString = atob(existingData.image);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
          updatedEvent.append(
            "image",
            new File([blob], "existing-image.jpg", { type: "image/jpeg" })
          );
        } else {
          updatedEvent.append("image", existingData.image);
        }
      }

      if (formData.video) {
        updatedEvent.append("video", formData.video);
      } else if (existingData.video) {
        updatedEvent.append("video", existingData.video);
      }

      console.log(
        "✏️ Updating event:",
        Object.fromEntries(updatedEvent.entries())
      );

      await updateCalendarEvent(editingEvent.id, updatedEvent);
      alert.success("✅ Event berhasil diperbarui!");
      setEditingEvent(null);
      resetForm();
      loadEvents();
    } catch (err) {
      console.error(`❌ Error editing event ID ${editingEvent.id}:`, err);
      alert.error("Gagal mengedit event. Cek koneksi atau coba lagi.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleImageOCR = async (file: File) => {
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      setOcrText(data.text.trim()); // Simpan hasil OCR di ocrText
    } catch (error) {
      console.error("OCR Error:", error);
      alert.error("Gagal memproses OCR pada gambar.");
    }
  };

  const checkAndDeleteExpiredEvents = async () => {
    try {
      const now = dayjs();
      console.log("🔍 Mengecek event yang sudah kadaluwarsa...");

      const expiredEvents = events.filter((event) =>
        dayjs(event.endTime).isBefore(now)
      );

      if (expiredEvents.length > 0) {
        console.log(
          `🗑 Menghapus ${expiredEvents.length} event yang sudah kedaluwarsa...`
        );
        for (const event of expiredEvents) {
          await handleDeleteEvent(event);
        }
        loadEvents();
      } else {
        console.log("✅ Tidak ada event yang perlu dihapus.");
      }
    } catch (err) {
      console.error("❌ Error saat menghapus event yang kedaluwarsa:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndDeleteExpiredEvents();
    }, 60000);

    return () => clearInterval(interval);
  }, [events]);

  const handleDeleteEvent = useCallback(async (event: Event) => {
    if (!event.id) {
      console.warn("⚠️ Tidak bisa menghapus event tanpa ID.");
      return;
    }

    try {
      const existingEvent = await fetchCalendarEventById(event.id);
      if (!existingEvent) {
        console.warn(
          `⚠️ Event ID ${event.id} tidak ditemukan sebelum penghapusan.`
        );
        alert.error(`Event sudah tidak ada di server.`);
        return;
      }

      console.log(`🗑 Deleting event ID ${event.id}`);
      await deleteCalendarEvent(event.id);
      console.log(`✅ Event ID ${event.id} deleted successfully.`);
      loadEvents();
    } catch (err) {
      console.error(`❌ Error deleting event ID ${event.id}:`, err);
    }
  }, [alert, loadEvents]);

  const memoizedSetEditingEvent = useCallback((event: Event | null) => {
    setEditingEvent(event);
  }, []);

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      await handleEditEvent();
    } else {
      await handleCreateEvent();
    }
  };

  const resetForm = () => {
    console.log("🔄 Resetting form");
    setFormData({
      note: "",
      description: "",
      startTime: "",
      endTime: "",
      image: null,
      video: null,
      previewImage: "",
      previewVideo: "",
    });
    setOcrText("");
  };

  return (
    <DashboardPageLayout
      siteTitle="Calendar Events"
      breadcrumbs={[{ label: "Events", url: "/events" }]}
    >
      <div className="w-full mx-auto p-8 space-y-8">
        <div className="max-w-lg w-full mx-auto mb-20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {editingEvent ? lang.text('editEvent') : lang.text("addEvent")}
          </h2>
          <form onSubmit={handleSubmitEvent} className="space-y-4 w-full">
            <Input
              type="text"
              placeholder={lang.text('titleEvent')}
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="text-lg w-full bg-transparent text-white border-gray-600 p-2 rounded-md"
            />
            <Textarea
              placeholder={lang.text('description')}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="text-lg w-full bg-transparent text-white border-gray-600 p-2 rounded-md"
            />
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col w-full">
                <label className="text-white text-sm mb-1">{lang.text('startHour')}</label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="bg-gray-800 text-white border-gray-600 text-lg w-full p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-white text-sm mb-1">{lang.text('endHour')}</label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="bg-gray-800 text-white border-gray-600 text-lg w-full p-2 rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 items-center">
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                  🖼️ {lang.text('uploadImage')} ({lang.text('must')})
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="upload-image"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      console.log("📸 Image selected:", file?.name);
                      setFormData({
                        ...formData,
                        image: file,
                        previewImage: file ? URL.createObjectURL(file) : formData.previewImage,
                      });
                      // if (file) handleImageOCR(file);
                    }}
                  />
                  {formData.previewImage && (
                    <img
                      src={formData.previewImage}
                      className="w-24 h-24 rounded-md mb-2"
                      alt="Preview"
                      onError={(e) => {
                        console.error("❌ Image preview failed to load");
                        e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                      }}
                    />
                  )}
                  <label
                    htmlFor="upload-image"
                    className="flex items-center justify-center w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-all"
                  >
                    📂 {formData.image ? formData.image.name : "Pilih Gambar"}
                  </label>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                  🎥 {lang.text('uploadVideo')} ({lang.text('optional')})
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="upload-video"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      console.log("🎥 Video selected:", file?.name);
                      setFormData({
                        ...formData,
                        video: file,
                        previewVideo: file ? URL.createObjectURL(file) : formData.previewVideo,
                      });
                    }}
                  />
                  {formData.previewVideo && (
                    <video
                      src={formData.previewVideo}
                      controls
                      className="w-48 h-28 mb-2"
                    />
                  )}
                  <label
                    htmlFor="upload-video"
                    className="flex items-center justify-center w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-all"
                  >
                    📂 {formData.video ? formData.video.name : "Pilih Video"}
                  </label>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-lg flex items-center justify-center p-2 rounded-md text-white ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {lang.text('progress')}
                </>
              ) : editingEvent ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Event"
              )}
            </Button>
            {
              editingEvent && (
                <Button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className={`w-full text-lg flex items-center justify-center p-2 rounded-md text-white`}
                >
                  <p className="text-black">{lang.text('cancel')}</p>
                </Button>

              )
            }
          </form>
        </div>
        <EventTable
          events={events}
          loading={loading}
          userRole={userRole}
          userId={userId}
          handleDeleteEvent={handleDeleteEvent}
          setEditingEvent={memoizedSetEditingEvent}
        />
      </div>
    </DashboardPageLayout>
  );
};