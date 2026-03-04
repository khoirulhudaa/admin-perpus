import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  Calendar,
  cn,
  dayjs,
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useState } from "react";
import { LibraryLandingTables } from "../container";
import { CalendarIcon } from "lucide-react";

export const LibraryLanding = () => {
  const [date, setDate] = useState<Date | undefined>(undefined); // No default date
  const [formattedDate, setFormattedDate] = useState<string>(""); // No default formatted date
  const [tahun, setTahun] = useState<string>(dayjs().format("YYYY")); // Initialize with current year

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

  // Debugging logs
  console.log('Formatted Date di LibraryLanding:', formattedDate || 'No date selected');
  console.log('Tahun di LibraryLanding:', tahun);

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("LibraryVisit")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("LibraryVisit"), url: "/library/visit" }]}
      title={lang.text("LibraryVisit")}
    >
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
            className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
            onClick={handleResetDate}
          >
            Reset
          </Button>
        )}
      </div>
      <LibraryLandingTables formattedDate={formattedDate || undefined} tahun={tahun} />
    </DashboardPageLayout>
  );
};