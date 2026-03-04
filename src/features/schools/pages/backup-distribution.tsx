import { APP_CONFIG } from '@/core/configs';
import { Button, Calendar, dayjs, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, lang, Popover, PopoverContent, PopoverTrigger } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { useProfile } from '@/features/profile';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { AttedancesReport, ReportOverview } from '../containers';
import { SchoolMap } from '../containers/school-map';
import { useSchool } from '../hooks';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export const SchoolDistribution = () => {

  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const [date, setDate] = useState<Date | undefined>();
  const profile = useProfile()
  const schools = useSchool()
  // console.log('ROLE:', profile?.user)

  const ROLE = profile.user?.role

  return (
    <React.Fragment>
      <DashboardPageLayout
        siteTitle={`${lang.text('schoolDistribution')} | ${APP_CONFIG.appName}`}
        title={lang.text('intro') + ',' + ` ${profile?.user?.name}` }
      >
          {
            <>
              <div className='w-full mt-6 flex justify-between items-baseline'>
                <div className='w-max flex gap-3'>
                  {
                    ROLE === 'superAdmin' ? (
                      <div className='w-max flex items-baseline'>
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='outline' className='flex items-center gap-5 px-5'>
                                        {selectedSchool || 'Pilih Sekolah'} <FaChevronDown />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className='ml-10 max-h-[250px] overflow-y-auto scroll-smooth no-scrollbar'>
                                    <DropdownMenuLabel>Sekolah</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {
                                      schools && schools.data.length > 0 ? (
                                        <div>
                                          {
                                            schools?.data?.map((data, index) => (
                                              <DropdownMenuItem key={index} onClick={() => setSelectedSchool(data.namaSekolah)}>{data.namaSekolah}</DropdownMenuItem>
                                            ))
                                          }
                                        </div>
                                      ):
                                      <DropdownMenuItem onClick={() => setSelectedSchool('')}>Tidak Tersedia</DropdownMenuItem>
                                    }
                                  </DropdownMenuContent>
                              </DropdownMenu>
                              {
                                selectedSchool ? (
                                    <Button variant='outline' onClick={() => setSelectedSchool('')} className='ml-4'>
                                        {lang.text('reset')}
                                    </Button>
                                ):
                                    <></>
                              }
                      </div>
                    ):
                    <></>
                  }
                   <div className="w-max flex">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-max bg-darkMode text-white justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>{lang.text('selectDate')}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                      {
                        date ? (
                            <Button variant='outline' onClick={() => setDate(undefined)} className='ml-4'>
                                {lang.text('reset')}
                            </Button>
                        ):
                            <></>
                      }
                    </div>
                </div>
                <div className='flex items-center'>
                  <Button variant='outline' disabled className='ml-4 px-6'>
                    {dayjs().tz('Asia/Jakarta').format('MMMM')}
                  </Button>
                </div>
              </div>
            </>
          }
          <div className='flex justify-between w-full'>
            
          </div>
        {/* <AttedancesReport selectDate={date} selectedSchool={selectedSchool} /> */}
        <AttedancesReport selectedSchool={selectedSchool} />
        <ReportOverview selectDate={date} selectedSchool={selectedSchool} />
        <SchoolMap />
        <div className="pb-16 sm:pb-0" />
      </DashboardPageLayout>
    </React.Fragment>
  );
};