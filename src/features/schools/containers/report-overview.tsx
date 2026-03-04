import { APP_CONFIG } from '@/core/configs';
import {
  Button,
  Calendar,
  Card, CardContent, CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { useProfile } from '@/features/profile';
import { useBiodataNew } from '@/features/user/hooks/use-biodata-new';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { ChartSemiCircle } from '../components';
import { SchoolByProvinceTable } from './school-by-province-table';

interface ReportOverviewProps {
  selectedSchool?: string;
}

export const ReportOverview = ({ selectedSchool }: ReportOverviewProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const profile = useProfile()
  const {dataOld: biodataNew} = useBiodataNew();
  // const biodataNew = useBiodataNew(profile?.user?.sekolahId);
  console.log('BIODATA NEW ABSEN::', biodataNew?.data);

  // Determine attendance stats based on selected date
  const attendanceStats = biodataNew?.data
    ? {
        totalHadir: date ? biodataNew.data.hari_ini_hadir : biodataNew.data.bulan_ini_jumlah_hadir,
        totalAlpa: date ? biodataNew.data.hari_ini_alpha : biodataNew.data.bulan_ini_jumlah_alpha,
        totalSakit: date ? biodataNew.data.hari_ini_sakit : biodataNew.data.bulan_ini_jumlah_sakit,
      }
    : { totalHadir: 0, totalAlpa: 0, totalSakit: 0 };

  // Update loading state based on stats
  useEffect(() => {
    if (
      biodataNew?.data &&
      (attendanceStats.totalHadir !== 0 || attendanceStats.totalAlpa !== 0 || attendanceStats.totalSakit !== 0)
    ) {
      setIsStatsLoading(false);
    } else {
      setIsStatsLoading(true);
    }
  }, [biodataNew?.data, attendanceStats]);

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('schoolDistribution')} | ${APP_CONFIG.appName}`}
      title={lang.text('ReportOverview') + '📋'}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-max justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>{lang.text('selectDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          {date && (
            <Button variant="outline" onClick={() => setDate(undefined)}>
              {lang.text('reset')}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* <Button
            variant="outline"
            onClick={() => document.getElementById('export-table')?.click()}
            className="flex items-center gap-2"
          >
            <FaFilePdf className="text-red-600" /> {lang.text('export')} <FaArrowDown />
          </Button> */}
        </div>
      </div>

      <div className="mt-4 w-full md:flex-row flex-col flex gap-8">
        {/* Left - Table */}
        <Card className="w-full md:w-1/2 bg-theme-color-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <h3 className="text-lg font-semibold">{lang.text('schoolData')}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
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
          </CardHeader>
          <CardContent>
            <SchoolByProvinceTable status={selectedStatus} />
          </CardContent>
        </Card>

        {/* Right - Chart */}
        <Card className="w-full md:w-1/2 bg-theme-color-primary/5">
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <ChartSemiCircle stats={attendanceStats} isLoading={isStatsLoading} />
            <div className="w-full mt-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#CC39FC]"></div>
                  <p className="text-muted-foreground">{lang.text('incomingAbsenceData')}</p>
                </div>
                <p className="text-2xl text-foreground">{attendanceStats.totalHadir}</p>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#0039F7]"></div>
                  <p className="text-muted-foreground">{lang.text('AbsenteeDataAbsent')}</p>
                </div>
                <p className="text-2xl text-foreground">{attendanceStats.totalAlpa}</p>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#00C3FC]"></div>
                  <p className="text-muted-foreground">{lang.text('sicknessAbsenceData')}</p>
                </div>
                <p className="text-2xl text-foreground">{attendanceStats.totalSakit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:pb-8 pb-8 sm:pb-0" />
    </DashboardPageLayout>
  );
};