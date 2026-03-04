import {
  Button,
  Calendar,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  simpleEncode,
} from "@/core/libs";
import { useDataTableController } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { StudentTableLibrary, useStudentPagination } from "@/features/student";
import dayjs from "dayjs";
import id from "dayjs/locale/id";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LibraryOverview } from "../container/library-overview";
import { RightPanel } from "../container/right-panel";
import { VisitorChart } from "../container/visitor-chart";

// Set Indonesian locale
dayjs.locale(id);

export const LibraryHomePage = () => {
  const profile = useProfile();
  const sekolahId = profile?.user?.sekolahId;
  const school = useSchoolDetail({ id: sekolahId || 1 });

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 9999 });

  const studentParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sekolahId: sekolahId ? +sekolahId : undefined,
      idKelas: undefined,
      keyword: global,
    }),
    [pagination.pageIndex, pagination.pageSize, sekolahId, global]
  );

  const { data, isLoading, refetch } = useStudentPagination(studentParams);
  console.log("data lib siswa survey:", data);

  const encryptPayload = simpleEncode(
    JSON.stringify({ id: school?.data?.id, text: school?.data?.namaSekolah })
  );

  // Initialize state with no default date
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState<string>("");
  // Initialize state tahun with current year
  const [tahun, setTahun] = useState<string>(dayjs().format("YYYY"));

  // State for rating filter
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      const formatted = dayjs(selectedDate).format("DD-MM-YYYY");
      setFormattedDate(formatted);
      console.log("Selected Date:", formatted, "Year:", tahun);
    } else {
      setFormattedDate("");
      console.log("No valid date selected");
    }
  };

  // Handle reset date
  const handleResetDate = () => {
    setDate(undefined);
    setFormattedDate("");
    console.log("Date reset: No date selected, Year:", tahun);
  };

  // Generate years: current year and 5 years before
  const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - 5 + i);

  // Filter and sort students based on ratingFilter, only include non-null and non-empty surveiApps
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];

    let result = [...(data.students?.data || [])].filter(
      (student) => student.surveiApps !== null && student.surveiApps !== undefined
    );

    if (ratingFilter === "highest") {
      // Sort descending (5 to 1)
      result = result.sort((a, b) => b.surveiApps - a.surveiApps);
    } else if (ratingFilter === "lowest") {
      // Sort ascending (1 to 5)
      result = result.sort((a, b) => a.surveiApps - b.surveiApps);
    }
    // For "all", return filtered students without additional sorting
    return result;
  }, [data?.students, ratingFilter]);

  return (
    <div className="pb-6">
      {school?.data?.serverPerpustakaan !== null &&
      (school?.data?.serverPerpustakaan !== "-" ||
        school?.data?.serverPerpustakaan.includes("https")) ? (
        <div className="relative space-y-6">
          {/* Date Picker, Year Dropdown, and Reset Button */}
          <div className="flex justify-between items-center space-x-4 relative">
            <div className="flex items-center gap-3.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      "bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date && !isNaN(date.getTime()) ? (
                      dayjs(date).format("DD MMMM YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formattedDate && (
                <Button
                  variant={"outline"}
                  className="bg-transparent dark:bg-gray-800 dark:text-white border border-white dark:border-gray-600"
                  onClick={handleResetDate}
                >
                  Reset
                </Button>
              )}
            </div>
              {formattedDate && (
                <Button variant={"outline"}>
                    <span className="text-sm">Selected: {formattedDate}</span>
                </Button>
              )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6">
              <LibraryOverview
                baseUrl="https://lib.sman1jkt.sch.id"
                formattedDate={formattedDate}
                tahun={tahun}
              />
              <VisitorChart formattedDate={formattedDate} tahun={tahun} />

              <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-md font-bold">Rating perpustakaan</h2>
                  {/* Uncomment if rating filter is needed */}
                  {/* <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className={cn("w-[180px]")}>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent className="relative right-3">
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="highest">Highest Rating (5 to 1)</SelectItem>
                      <SelectItem value="lowest">Lowest Rating (1 to 5)</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>

                {filteredStudents.length > 0 ? (
                  <StudentTableLibrary
                    data={filteredStudents}
                    isLoading={isLoading}
                    pagination={{
                      pageIndex: pagination.pageIndex,
                      pageSize: pagination.pageSize,
                      totalItems: filteredStudents.length,
                      onPageChange: (page) =>
                        onPaginationChange({ ...pagination, pageIndex: page }),
                      onSizeChange: (size) =>
                        onPaginationChange({
                          ...pagination,
                          pageSize: size,
                          pageIndex: 0,
                        }),
                    }}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                  />
                ) : (
                  <div className="border border-white/10 p-10 text-center text-md text-gray-500 dark:text-gray-400">
                    Belum ada rating
                  </div>
                )}
              </div>
            </div>
            <RightPanel />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center h-full">
          <img src={"/book2.png"} alt="book" className="w-[14%]" />
          <p className="mb-6 mt-7">
            Belum menambahkan serverPerpustakaan di detail sekolah
          </p>
          <Link to={`/schools/${encryptPayload}`}>
            <Button
              size={"lg"}
              variant={"default"}
              className="flex items-center"
            >
              <p>Perbarui data sekolah</p>
              <ArrowRight className="relative top-[-0.4px]" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};