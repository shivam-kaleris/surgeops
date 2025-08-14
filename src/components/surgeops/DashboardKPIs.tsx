import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Ship, AlertTriangle, Container } from "lucide-react";
import type { KPIData } from "../../lib/mockData";

interface DashboardKPIsProps {
  data: KPIData;
}

export function DashboardKPIs({ data }: DashboardKPIsProps) {
  const kpiCards = [
    {
      title: "Avg Yard Utilization",
      value: `${data.avgYardUtilization}%`,
      icon: TrendingUp,
      color: data.avgYardUtilization >= 85 ? "destructive" : data.avgYardUtilization >= 75 ? "warning" : "success",
      trend: "+2.3%"
    },
    {
      title: "Waiting Vessels (48h)",
      value: data.waitingVessels,
      icon: Ship,
      color: data.waitingVessels >= 10 ? "destructive" : data.waitingVessels >= 5 ? "warning" : "success",
      trend: "Next 48h"
    },
    {
      title: "Active Alerts",
      value: data.activeAlerts,
      icon: AlertTriangle,
      color: data.activeAlerts >= 3 ? "destructive" : data.activeAlerts >= 1 ? "warning" : "success",
      trend: data.activeAlerts > 0 ? "Requires attention" : "All clear"
    },
    {
      title: "TEU Processed (24h)",
      value: data.teuProcessed24h.toLocaleString(),
      icon: Container,
      color: "primary" as const,
      trend: "+5.2%"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "destructive":
        return "bg-red-500 text-white shadow-red-200";
      case "warning":
        return "bg-amber-500 text-white shadow-amber-200";
      case "success":
        return "bg-emerald-500 text-white shadow-emerald-200";
      case "primary":
      default:
        return "bg-blue-500 text-white shadow-blue-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {kpiCards.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="animate-fade-in-up"
        >
          <Card className="bg-gradient-card shadow-depth border-0 hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {kpi.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-primary/10 transition-colors">
                <kpi.icon className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="text-2xl font-bold text-slate-800">
                {kpi.value}
              </div>
              <Badge 
                className={`${getColorClasses(kpi.color)} text-xs font-medium px-2 py-1 shadow-sm`}
                variant="secondary"
              >
                {kpi.trend}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}