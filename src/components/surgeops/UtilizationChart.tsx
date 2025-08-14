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
  const chartData = {
    labels: data.map(point => point.time),
    datasets: [
      {
        label: "Yard Utilization %",
        data: data.map(point => point.utilization),
        borderColor: "hsl(210 100% 40%)",
        backgroundColor: "hsl(210 100% 40% / 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "hsl(210 100% 40%)",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "Critical Threshold",
        data: data.map(point => point.threshold),
        borderColor: "hsl(0 84.2% 60.2%)",
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
            size: 12
          },
          color: "hsl(210 40% 8%)",
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "hsl(0 0% 100%)",
        titleColor: "hsl(210 40% 8%)",
        bodyColor: "hsl(210 40% 8%)",
        borderColor: "hsl(214.3 31.8% 91.4%)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
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
          color: "hsl(215.4 16.3% 46.9%)",
          font: {
            size: 12,
            weight: "bold" as const
          }
        },
        grid: {
          color: "hsl(214.3 31.8% 91.4% / 0.5)",
          drawBorder: false
        },
        ticks: {
          color: "hsl(215.4 16.3% 46.9%)",
          font: {
            size: 11
          },
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Utilization %",
          color: "hsl(215.4 16.3% 46.9%)",
          font: {
            size: 12,
            weight: "bold" as const
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: "hsl(214.3 31.8% 91.4% / 0.5)",
          drawBorder: false
        },
        ticks: {
          color: "hsl(215.4 16.3% 46.9%)",
          font: {
            size: 11
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
    <Card className="bg-card shadow-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            24-Hour Utilization Trend
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Current: {currentUtilization}% 
            <span className={`ml-2 ${trend >= 0 ? 'text-destructive' : 'text-success'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}