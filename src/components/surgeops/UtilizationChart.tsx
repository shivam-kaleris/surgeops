import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { ChartDataPoint } from "../../lib/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UtilizationChartProps {
  data: ChartDataPoint[];
}

export function UtilizationChart({ data }: UtilizationChartProps) {
  // Generate prediction data (future 4 hours)
  const predictionData = Array.from({length: 4}, (_, i) => {
    const lastUtilization = data[data.length - 1]?.utilization || 70;
    const trend = data.length >= 2 ? data[data.length - 1].utilization - data[data.length - 2].utilization : 0;
    return lastUtilization + (trend * (i + 1)) + (Math.random() - 0.5) * 5;
  });

  const chartData = {
    labels: [
      ...data.map(point => point.time),
      ...Array.from({length: 4}, (_, i) => {
        const hour = new Date().getHours() + i + 1;
        return `${hour.toString().padStart(2, '0')}:00`;
      })
    ],
    datasets: [
      {
        label: "Yard Utilization %",
        data: [...data.map(point => point.utilization), ...Array(4).fill(null)],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgb(59, 130, 246)",
        pointHoverBorderColor: "rgb(255, 255, 255)"
      },
      {
        label: "Prediction",
        data: [...Array(data.length).fill(null), ...predictionData],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [8, 4],
        fill: false,
        tension: 0.3,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(16, 185, 129)",
        pointHoverBorderColor: "rgb(255, 255, 255)"
      },
      {
        label: "Critical Threshold",
        data: [...data.map(point => point.threshold), ...Array(4).fill(95)],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
            family: "ui-sans-serif, system-ui",
            weight: 500
          },
          color: "rgb(71, 85, 105)",
          usePointStyle: true,
          pointStyle: "circle",
          boxHeight: 8,
          padding: 20
        }
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgb(255, 255, 255)",
        titleColor: "rgb(30, 41, 59)",
        bodyColor: "rgb(71, 85, 105)",
        borderColor: "rgb(226, 232, 240)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 13, weight: 600 },
        bodyFont: { size: 12 },
        boxPadding: 6
      }
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time (24H)",
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 12,
            weight: "bold" as const,
            family: "ui-monospace, monospace"
          }
        },
        grid: {
          color: "rgba(226, 232, 240, 0.5)",
          drawBorder: false
        },
        ticks: {
          color: "rgb(100, 116, 139)",
          font: {
            size: 11,
            family: "ui-monospace, monospace"
          },
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Utilization %",
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 12,
            weight: "bold" as const,
            family: "ui-monospace, monospace"
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: "rgba(226, 232, 240, 0.5)",
          drawBorder: false
        },
        ticks: {
          color: "rgb(100, 116, 139)",
          font: {
            size: 11,
            family: "ui-monospace, monospace"
          },
          callback: function(value) {
            return value + "%";
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const currentUtilization = data[data.length - 1]?.utilization || 0;
  const previousUtilization = data[data.length - 2]?.utilization || 0;
  const trend = currentUtilization - previousUtilization;

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Yard Utilization Trend
          </CardTitle>
          <p className="text-xs text-slate-600 mt-1">
            Current: <span className="font-mono text-blue-700 font-semibold">{currentUtilization}%</span>
            <span className={`ml-2 font-mono font-semibold ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
            <span className="ml-2 text-slate-500">• Updates every 5min</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0 bg-white">
        <div className="h-72 p-2">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}