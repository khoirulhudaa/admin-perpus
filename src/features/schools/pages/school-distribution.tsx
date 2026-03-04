import { APP_CONFIG } from '@/core/configs';
import { Button, dayjs, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { StudentDemographicsCharts } from '@/features/dashboard/containers';
import { useProfile } from '@/features/profile';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { AttedancesReport, ReportOverview } from '../containers';
import { useSchool } from '../hooks';

export const SchoolDistribution = () => {

  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const profile = useProfile()
  const schools = useSchool()

  const ROLE = profile.user?.role
  console.log('IDENTITAS', profile?.user)

  return (
    <React.Fragment>
      <DashboardPageLayout
        siteTitle={`${lang.text('schoolDistribution')} | ${APP_CONFIG.appName}`}
        title={lang.text('intro') + ',' + ` ${profile?.user?.name} 😁` }
      >
          {
            ROLE === 'superAdmin' ? (
              <>
                <div className='w-full mt-6 flex justify-between items-baseline'>
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
                    <div className='flex items-center'>
                      <Button variant='outline' disabled className='ml-4 px-6'>
                        {dayjs().tz('Asia/Jakarta').format('MMMM')}
                      </Button>
                    </div>
                 </div>
              </>
            ):
            <></>
          }
        
        <AttedancesReport selectedSchool={selectedSchool} />
        <ReportOverview selectedSchool={selectedSchool} />
        {
          profile?.user?.role !== 'superAdmin' && (
            <StudentDemographicsCharts /> 
          )
        }
        {/* <SchoolMap /> */}
        <div className="mt-10 pb-16 sm:pb-0" />
      </DashboardPageLayout>
    </React.Fragment>
  );
};