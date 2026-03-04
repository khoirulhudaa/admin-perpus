import { Card, CardContent } from "@/core/libs";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Stats {
  totalHadir: number;
  totalAlpa: number;
  totalSakit: number;
  totalDispensasi: number;
}

interface ChartInterface {
  stats: Stats;
  isLoading: boolean;
}

export const ChartSemiCircle = ({ stats, isLoading }: ChartInterface) => {
  // Data untuk chart
  const data = {
    labels: ['Hadir', 'Alpa', 'Sakit'],
    datasets: [
      {
        data: [
          stats.totalHadir,
          stats.totalAlpa,
          stats.totalSakit,
        ],
        backgroundColor: ['#CC39FC', '#0039F7', '#00C3FC'],
        borderWidth: 0,
      },
    ],
  };

  // Opsi untuk membuat chart setengah lingkaran
  const options = {
    rotation: -90,
    circumference: 180,
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false, // Allow custom height
  };

  const total = stats.totalHadir + stats.totalAlpa + stats.totalSakit;

  return (
    <Card className="w-full h-[260px] relative bg-theme-color-primary/5">
      <CardContent className="p-0 flex items-center justify-center h-full">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            <Doughnut data={data} options={options} className="mx-auto" />
            <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-3xl font-medium text-foreground">
                {total ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Data</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};