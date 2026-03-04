import { Card, CardContent, CardHeader, CardTitle, lang } from '@/core/libs';
import { useClassroom } from '@/features/classroom';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { AlertCircle, AlertCircleIcon, Disc, Filter, FilterIcon, MessageSquareWarning, NotepadText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { FaSpinner } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Custom plugin to add emojis in the middle of the bars
const emojiPlugin = {
  id: 'emojiPlugin',
  afterDatasetsDraw(chart: ChartJS) {
    const { ctx, data, scales } = chart;

    ctx.save();
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index] as number;
        if (value === 0) return;

        const y = bar.y;
        const emoji = datasetIndex === 0 ? '👨' : '👩';

        const emojiX = scales.x.getPixelForValue(value / 2);
        const emojiY = y;

        ctx.fillText(emoji, emojiX, emojiY);
      });
    });

    ctx.restore();
  },
};

export const StudentDemographicsCharts = ({ selectedSchool }: { selectedSchool?: string }) => {
  // const students = useStudents({
  //   page: 1,
  //   size: 600,
  //   sekolahId: 1,
  //   kelas: 'all',
  // });
  // const profile = useProfile()
  //  const studentParams = useMemo(() => ({
  //     page: 1,
  //     size: 9999,
  //     sekolahId: profile?.user?.sekolahId ? profile?.user?.sekolahId : undefined,
  //     keyword: '',
  // }), [profile?.user?.sekolahId, '']);
  
  // const { data } = useStudentPagination(studentParams); // Pastikan refetch diambil dari hook
  const classRooms = useClassroom();

  // State to track current theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect theme changes
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Check if data is still loading or not available
  const isLoading = classRooms.isLoading;
  const hasError = classRooms.error;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-theme-color-primary/5">
        <Card>
          <CardContent className="py-10 flex flex-col justify-center items-center">
            <FaSpinner className="text-[24px] animate-spin duration-1500 opacity-30" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-10 flex flex-col justify-center items-center">
            <FaSpinner className="text-[24px] animate-spin duration-1500 opacity-30" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasError || !classRooms.data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-theme-color-primary/5">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{lang.text('fail')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{lang.text('fail')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Process gender data
  const genderData = classRooms.data.reduce(
    (acc, classroom) => {
      acc.male += classroom.jumlahSiswaPria || 0;
      acc.female += classroom.jumlahSiswaWanita || 0;
      return acc;
    },
    { male: 0, female: 0 }
  );

  console.log('classRoom nowsss:', classRooms?.data)
  
  // Process class data with validation
  const classData = classRooms.data.reduce((acc, classroom) => {
    const studentCount = classroom.jumlahSiswa || 0;
    const className = classroom.namaKelas?.trim() || 'Unknown';
    if (className && studentCount > 0) {
      acc[className] = (acc[className] || 0) + studentCount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  console.log('classRoom classData:', classData)

  // Define theme-aware colors
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  const maleColor = theme === 'dark' ? '#9333EA' : '#9333EA'; // purple-600
  const femaleColor = theme === 'dark' ? '#F472B6' : '#EC4899'; // pink-400 (dark), pink-500 (light)
  const classColor = theme === 'dark' ? '#3B82F6' : '#2563EB'; // blue-500 (dark), blue-600 (light)

  // Prepare Bar chart data for gender distribution
  const genderChartData = {
    labels: [lang.text('male'), lang.text('female')],
    datasets: [
      {
        label: lang.text('male'),
        data: [genderData.male, 0],
        backgroundColor: maleColor,
        borderColor: maleColor,
        borderWidth: 1,
      },
      {
        label: lang.text('female'),
        data: [0, genderData.female],
        backgroundColor: femaleColor,
        borderColor: femaleColor,
        borderWidth: 1,
      },
    ],
  };

  // Prepare Bar chart data for class distribution
  const classChartData = {
    labels: Object.keys(classData).filter(label => label !== 'Unknown'), // Exclude 'Unknown' if present
    datasets: [
      {
        label: lang.text('student'),
        data: Object.values(classData).filter((_, index) => Object.keys(classData)[index] !== 'Unknown'),
        backgroundColor: classColor,
        borderColor: classColor,
        borderWidth: 1,
      },
    ],
  };

  // Gender Bar chart options (horizontal)
  // const genderBarOptions = {
  //   indexAxis: 'y' as const,
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top' as const,
  //       labels: {
  //         color: textColor,
  //       },
  //     },
  //     title: {
  //       display: true,
  //       text: lang.text('gender'),
  //       color: textColor,
  //       font: { size: 16 },
  //     },
  //     emojiPlugin: true,
  //   },
  //   scales: {
  //     x: {
  //       beginAtZero: true,
  //       title: {
  //         display: true,
  //         text: lang.text('student'),
  //         color: textColor,
  //       },
  //       ticks: {
  //         color: textColor,
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: lang.text('gender'),
  //         color: textColor,
  //       },
  //       ticks: {
  //         color: textColor,
  //       },
  //     },
  //   },
  // };
  
  const genderBarOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false, // Tambahkan ini untuk memungkinkan grafik mengisi kontainer
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: lang.text('gender'),
        color: textColor,
        font: { size: 16 },
      },
      emojiPlugin: true,
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: lang.text('student'),
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        title: {
          display: true,
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  // Class Bar chart options (vertical)
  const classBarOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: lang.text('studentsPerClass'),
        color: textColor,
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: lang.text('student'),
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
      x: {
        title: {
          display: true,
          text: lang.text('classRoom'),
          color: textColor,
        },
        ticks: {
          color: textColor,
          autoSkip: false, // Prevent skipping labels
          maxRotation: 45, // Rotate labels if needed
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="flex md:flex-col flex-col gap-8">
      {/* Class Vertical Bar Chart */}
      <Card className="w-full md:w-full h-max md:h-[400px] bg-theme-color-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">{lang.text('studentsPerClass')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] pb-10">
          {classChartData.labels.length > 0 ? (
            <Bar data={classChartData} options={classBarOptions} />
          ) : (
            <p className="text-center text-muted-foreground mt-[100px]">{lang.text('noReport')}</p>
          )}
        </CardContent>
      </Card>

      {/* Gender Horizontal Bar Chart */}
      <Card className="w-full md:w-full h-max md:h-[400px] bg-theme-color-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">{lang.text('gender')}</CardTitle>
          <p className='text-slate-400 flex items-center text-sm gap-1'>
            <AlertCircle className='scale-[0.7] text-blue-400 relative top-[0.8px]' />
            (Hanya menghitung siswa yang sudah mengisi data jenis kelamin saja)
          </p>
        </CardHeader>
        <CardContent className="w-full h-[calc(100%-4rem)] p-0">
          <div className="chart-container w-full h-full pb-10">
            <Bar className="w-full h-full" data={genderChartData} options={genderBarOptions} plugins={[emojiPlugin]} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};