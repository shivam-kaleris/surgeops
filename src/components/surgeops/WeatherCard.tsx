import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Thermometer, Wind, Droplets, Eye } from "lucide-react";
import type { WeatherData } from "../../lib/mockData";

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const getImpactColor = (impact: WeatherData["operationalImpact"]) => {
    switch (impact) {
      case "High":
        return "bg-destructive text-destructive-foreground";
      case "Medium":
        return "bg-warning text-warning-foreground";
      case "Low":
      default:
        return "bg-success text-success-foreground";
    }
  };

  const weatherMetrics = [
    {
      label: "Temperature",
      value: `${weather.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-secondary"
    },
    {
      label: "Wind Speed",
      value: `${weather.windSpeed.toFixed(1)} km/h`,
      icon: Wind,
      color: weather.windSpeed > 20 ? "text-destructive" : "text-accent"
    },
    {
      label: "Humidity",
      value: `${Math.round(weather.humidity)}%`,
      icon: Droplets,
      color: "text-primary"
    }
  ];

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Cloud className="h-5 w-5 text-primary" />
          Weather Conditions
        </CardTitle>
        <p className="text-sm text-muted-foreground">{weather.location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Condition */}
        <div className="text-center p-4 bg-gradient-depth rounded-lg">
          <div className="text-4xl mb-2">{weather.icon}</div>
          <div className="text-xl font-bold">{weather.condition}</div>
          <Badge className={`mt-2 ${getImpactColor(weather.operationalImpact)}`}>
            {weather.operationalImpact} Impact
          </Badge>
        </div>

        {/* Weather Metrics */}
        <div className="space-y-3">
          {weatherMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="font-medium">{metric.label}</span>
              </div>
              <span className="text-lg font-bold">{metric.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Operational Alerts */}
        {weather.windSpeed > 20 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center gap-2 text-destructive">
              <Wind className="h-4 w-4" />
              <span className="font-medium">High Wind Alert</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Crane operations may be affected
            </p>
          </motion.div>
        )}

        {/* Update Timestamp */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}