import { Card, CardContent, CardHeader, CardTitle } from '@/core/libs';
import { Icon, IconProps } from '@/features/_global';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

export interface CardCounterProps {
  label?: string;
  icon?: IconProps['lucideIcon'];
  infoText?: string;
  value?: string; // String yang mengandung angka
}

export const CardCounter = React.memo((props: CardCounterProps) => {
  // Ubah props.value menjadi angka dan buat data grafik
  const value = parseInt(props.value || '0', 10);
  const simulatedData = Array(6)
    .fill(0)
    .map(() => value + Math.floor(Math.random() * 10 - 5));
  // Simulasi data dengan variasi
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Data untuk Chart.js
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Trend',
        data: simulatedData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: (context: any) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 180);
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
          gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        hoverRadius: 6, // Perbesar titik saat dihover
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hilangkan label "Trend"
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return labels[index]; // Menampilkan nama bulan sebagai judul tooltip
          },
          label: (tooltipItem: any) => {
            const correctValue =
              tooltipItem.dataset.data[tooltipItem.dataIndex]; // Ambil langsung dari dataset
            return `Value: ${correctValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false, // Sembunyikan sumbu X
      },
      y: {
        display: false, // Sembunyikan sumbu Y
      },
    },
  };

  return (
    <Card>
    {/* <Card className="bg-theme-color-primary/5"> */}
      <CardHeader className="bg-theme-color-primary/5 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.label}</CardTitle>
        <Icon
          lucideIcon={props.icon}
          className="h-4 w-4 text-muted-foreground"
        />
      </CardHeader>
      <CardContent className='bg-theme-color-primary/5'>
        <div className="text-2xl font-bold mb-4">{props.value}</div>
        <div style={{ height: '100px' }}>
          <Line data={data} options={options} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{props.infoText}</p>
      </CardContent>
    </Card>
  );
});
