import { APP_CONFIG } from '@/core/configs';
import { Button, dayjs, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { useBiodata } from '@/features/user';
import { useMemo, useState } from 'react';
import { FaArrowDown, FaChevronDown } from 'react-icons/fa';
import { ChartSemiCircle } from '../components';
import { calculateAttendanceStats } from '../utils';
import { SchoolByProvinceTable } from './school-by-province-table';

interface ReportOverviewProps {
  selectedSchool?: string;
  selectDate?: Date;
}

export const ReportOverview = ({ selectedSchool, selectDate }: ReportOverviewProps) => {
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedClass] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const biodata = useBiodata();

  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm:ss')
      : 'N/A';
  };

  // Filter data based on selectedSchool
  const filteredBySchool = useMemo(() => {
    if (!biodata.data) return [];
    if (!selectedSchool) return biodata.data;
    return biodata.data.filter(
      (student) => student.user?.sekolah?.namaSekolah === selectedSchool
    );
  }, [biodata.data, selectedSchool]);

  // Determine the target date (today if selectDate is undefined, otherwise selectDate)
  const targetDate = useMemo(() => {
    return selectDate
      ? dayjs(selectDate).tz('Asia/Jakarta').startOf('day')
      : dayjs().tz('Asia/Jakarta').startOf('day');
  }, [selectDate]);

  // Filter data based on target date and class
  const filteredData = useMemo(() => {
    return (
      filteredBySchool
        .flatMap((student) =>
          student.absensis
            ?.filter((attendance) => {
              const attendanceDate = dayjs(attendance.jamMasuk).tz('Asia/Jakarta');
              return attendanceDate.isSame(targetDate, 'day');
            })
            .map((attendance) => ({
              ...student,
              attendance: {
                ...attendance,
                jamMasuk: formatTime(attendance.jamMasuk),
                jamPulang: formatTime(attendance.jamPulang),
              },
            }))
        )
        .filter((student) =>
          selectedClass ? student.kelas?.namaKelas === selectedClass : true
        ) || []
    );
  }, [filteredBySchool, targetDate, selectedClass]);

  // Calculate attendance stats
  const attendanceStats = useMemo(() => {
    const stats = calculateAttendanceStats(filteredData);
    console.log('stats here:', stats);
    if (stats.totalHadir !== 0 || stats.totalAlpa !== 0 || stats.totalSakit !== 0) {
      setIsStatsLoading(false);
    } else {
      setIsStatsLoading(true);
    }
    return stats;
  }, [filteredData]);

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('schoolDistribution')} | ${APP_CONFIG.appName}`}
      title={lang.text('ReportOverview')}
    >
      <div className="w-full flex items-center justify-between">
        {/* <div className="w-[20px] flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-max bg-darkMode text-white justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectDate ? format(selectDate, 'PPP') : <span>{lang.text('selectDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectDate} onSelect={() => {}} initialFocus />
            </PopoverContent>
          </Popover>
          {
            selectDate ? (
                <Button variant='outline' onClick={() => {}} className='ml-4'>
                    {lang.text('reset')}
                </Button>
            ):
                <></>
          }
        </div> */}
        <div className="ml-auto flex justify-end items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => document.getElementById('export-table')?.click()}
            className="bg-darkMode text-slate-400"
          >
            {lang.text('export')} <FaArrowDown />
          </Button>
        </div>
      </div>

      <div className="mt-6 w-full flex gap-8">
        {/* Left - Table */}
        <div className="w-1/2 bg-darkMode rounded-lg p-6">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[1.3vw]">{lang.text('schoolData')}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-5 px-5">
                  {selectedStatus || lang.text('selectStatus')} <FaChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus('Aktif')}>
                  {lang.text('active')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('Tidak Aktif')}>
                  {lang.text('inactive')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(undefined)}>
                  {lang.text('allStatus')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <SchoolByProvinceTable status={selectedStatus} />
        </div>

        {/* Right - Chart */}
        <div className="text-center bg-darkMode rounded-lg p-8 w-1/2 flex items-center justify-center flex-col">
          <ChartSemiCircle stats={attendanceStats} isLoading={isStatsLoading} />
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#CC39FC]"></div>
                <p className="text-slate-400">{lang.text('incomingAbsenceData')}</p>
              </div>
              <p className="text-2vw text-slate-300">{attendanceStats.totalHadir}</p>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#0039F7]"></div>
                <p className="text-slate-400">{lang.text('AbsenteeDataAbsent')}</p>
              </div>
              <p className="text-2vw text-slate-300">{attendanceStats.totalAlpa}</p>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00C3FC]"></div>
                <p className="text-slate-400">{lang.text('sicknessAbsenceData')}</p>
              </div>
              <p className="text-2vw text-slate-300">{attendanceStats.totalSakit}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};