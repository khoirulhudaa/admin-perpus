import { Button, lang } from "@/core/libs";
import { BaseDataTable, BaseTableHeader } from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Pen, Trash } from "lucide-react";

interface EventTableProps {
  events: Event[];
  loading: boolean;
  userRole: string | undefined;
  userId: number | null;
  handleDeleteEvent: (event: Event) => Promise<void>;
  setEditingEvent: (event: Event | null) => void;
}

export const EventTable = ({
  events,
  loading,
  userRole,
  userId,
  handleDeleteEvent,
  setEditingEvent,
}: EventTableProps) => {
  const columns: ColumnDef<Event>[] = [
    {
      header: "No.",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      id: "no",
    },
    { accessorKey: "note", header: "Judul Event" },
    { accessorKey: "description", header: "Deskripsi" },
    {
      accessorKey: "startTime",
      header: ({ column }) => {
             return (
               <BaseTableHeader
                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                 {lang.text("startHour")}
               </BaseTableHeader>
             );
           },
      cell: ({ cell }) =>
        dayjs(cell.getValue() as string).format("DD/MM/YYYY HH:mm"),
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("endHour")}
          </BaseTableHeader>
        );
      },
      cell: ({ cell }) =>
        dayjs(cell.getValue() as string).format("DD/MM/YYYY HH:mm"),
    },
    {
      accessorKey: "image",
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("image")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const imageData = row.original.image;

        if (imageData) {
          const imageSrc = `data:image/jpeg;base64,${imageData}`;
          return (
            <img
              src={imageSrc}
              alt="Gambar Event"
              className="w-16 h-16 object-cover rounded-md"
            />
          );
        } else {
          return <span className="text-gray-500">{lang.text('notFoundImage')}</span>;
        }
      },
    },
    {
      id: "video",
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("video")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) =>
        row.original.video ? (
          <video
            src={row.original.video}
            controls
            className="w-24 h-16 rounded-md"
          />
        ) : (
          <span className="text-gray-500">Tidak ada video</span>
        ),
    },
    {
      id: "actions",
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("actions")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const event = row.original;
        const storedEventCreator = localStorage.getItem(`event_${event.note}`);
        // const isCreatedByCurrentUser = storedEventCreator
        //   ? storedEventCreator === userId?.toString()
        //   : false;

        // console.log("🛠 Event Data:", event);
        // console.log("🔎 Current User Role:", userRole);
        // console.log("🔎 Current User ID:", userId);
        // console.log(
        //   "🔎 Event Created By Current User:",
        //   isCreatedByCurrentUser
        // );

        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => setEditingEvent(event)}
              className="bg-transparent border border-white/30 hover:text-black text-white p-2 w-[40px] h-[40px] rounded-md"
            >
              <Pen />
            </Button>
            <Button
              onClick={() => handleDeleteEvent(event)}
              className="bg-red-500 hover:bg-red-600 text-white p-1 w-[40px] h-[40px] rounded-md"
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <BaseDataTable
      columns={columns}
      data={events}
      isLoading={loading}
      dataFallback={[]}
    />
  );
};