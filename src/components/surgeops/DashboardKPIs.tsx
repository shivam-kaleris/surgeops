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
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "success":
        return "bg-success text-success-foreground";
      case "primary":
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="animate-fade-in-up"
        >
          <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
            kpi.color === 'destructive' ? 'bg-gradient-to-br from-red-50 to-red-100' :
            kpi.color === 'warning' ? 'bg-gradient-to-br from-amber-50 to-yellow-100' :
            kpi.color === 'success' ? 'bg-gradient-to-br from-emerald-50 to-green-100' :
            'bg-gradient-to-br from-blue-50 to-indigo-100'
          }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
                <kpi.icon className="w-full h-full" />
              </div>
            </div>
            
            {/* Content */}
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  kpi.color === 'destructive' ? 'bg-red-100 text-red-600' :
                  kpi.color === 'warning' ? 'bg-amber-100 text-amber-600' :
                  kpi.color === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <Badge 
                  className={`${getColorClasses(kpi.color)} text-xs font-semibold px-3 py-1 shadow-sm`}
                  variant="secondary"
                >
                  {kpi.trend}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {kpi.title}
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {kpi.value}
                </p>
              </div>
              
              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                kpi.color === 'destructive' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                kpi.color === 'warning' ? 'bg-gradient-to-r from-amber-400 to-yellow-600' :
                kpi.color === 'success' ? 'bg-gradient-to-r from-emerald-400 to-green-600' :
                'bg-gradient-to-r from-blue-400 to-indigo-600'
              }`} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}