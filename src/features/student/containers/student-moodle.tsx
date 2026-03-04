import { tableColumnSiswaFallback } from '../utils';
import { BaseDataTable } from '@/features/_global';
import { lang } from '@/core/libs';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface Detail {
  id: number;
  data: {
    user: {
      sekolahId: number;
      nis: number;
    };
  };
}

interface CourseData {
  no: number;
  displayname: string;
  progress: number | null;
  lastaccess: string;
  lastaccessTimestamp: number;
}

export function StudentMoodleTable({ detail }: { detail: Detail }) {
  const sekolahId = detail.data?.user?.sekolahId;
  const username = detail.data?.user?.nis;

  console.log('🚀 ~ All User Details:', detail);
  console.log('🚀 ~ Sekolah ID:', sekolahId);
  console.log('🚀 ~ Username (NIS):', username);

  if (!sekolahId || !username) {
    console.error('Sekolah ID atau Username tidak tersedia!');
    return <div>Data tidak valid</div>;
  }

  const MOODLE_BASE_URL = import.meta.env.VITE_MOODLE_KIRA_BASE_URL;

  const {
    data: moodleData,
    isLoading,
    error,
  } = useQuery<CourseData[], Error>({
    queryKey: ['moodleCourses', sekolahId, username],
    queryFn: async (): Promise<CourseData[]> => {
      if (!MOODLE_BASE_URL) {
        console.error(
          'VITE_MOODLE_KIRA_BASE_URL tidak ditemukan di environment variables.',
        );
        throw new Error(
          'Environment variable VITE_MOODLE_KIRA_BASE_URL tidak tersedia.',
        );
      }

      // Bangun URL API
      const apiUrl = new URL(
        `/api/courses/${sekolahId}/${username}`,
        MOODLE_BASE_URL,
      ).toString();

      console.log('Fetching data from:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('Failed to fetch data:', response.statusText);
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      return data.map(
        (
          {
            displayname,
            progress,
            lastaccess,
          }: {
            displayname: string;
            progress: number | null;
            lastaccess: number;
          },
          index: number,
        ): CourseData => ({
          no: index + 1,
          displayname,
          progress,
          lastaccess: new Date(lastaccess * 1000).toLocaleDateString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          lastaccessTimestamp: lastaccess,
        }),
      );
    },
  });

  // Handle success or error outside useQuery using React effects
  React.useEffect(() => {
    if (moodleData) {
      console.log('🚀 ~ Data successfully fetched and sent:', moodleData);
    }
    if (error) {
      console.error('🚀 ~ Error fetching data:', error);
    }
  }, [moodleData, error]);

  const columns = useMemo(
    () => [
      {
        header: 'No',
        accessorKey: 'no',
        id: 'index',
        cell: ({ row }: { row: { original: CourseData } }) => (
          <div style={{ textAlign: 'left', paddingLeft: '12px' }}>
            {row.original.no}
          </div>
        ),
      },
      {
        header: 'Display Name',
        accessorKey: 'displayname',
        cell: ({ row }: { row: { original: CourseData } }) => (
          <div style={{ textAlign: 'left', paddingLeft: '12px' }}>
            {row.original.displayname}
          </div>
        ),
      },
      {
        header: 'Progress',
        accessorKey: 'progress',
        cell: ({ row }: { row: { original: CourseData } }) => (
          <div style={{ textAlign: 'left', paddingLeft: '12px' }}>
            <div
              style={{
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                width: '80%',
                height: '10px',
              }}
            >
              {row.original.progress ? (
                <div
                  style={{
                    width: `${row.original.progress}%`,
                    backgroundColor: '#4caf50',
                    height: '100%',
                  }}
                ></div>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        header: 'Last Access',
        accessorKey: 'lastaccess',
        cell: ({ row }: { row: { original: CourseData } }) => (
          <div style={{ textAlign: 'left', paddingLeft: '12px' }}>
            {row.original.lastaccess}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <BaseDataTable
      columns={columns}
      data={(moodleData || []).map((item: CourseData, index: number) => ({
        ...item,
        no: index + 1,
      }))}
      dataFallback={tableColumnSiswaFallback}
      globalSearch
      searchPlaceholder={lang.text('search')}
      isLoading={isLoading}
    />
  );
}
