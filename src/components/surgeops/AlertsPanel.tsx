import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, X, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { Alert } from "../../lib/mockData";

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-destructive text-destructive-foreground";
      case "HIGH":
        return "bg-destructive/80 text-destructive-foreground";
      case "MEDIUM":
        return "bg-warning text-warning-foreground";
      case "LOW":
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getSeverityIcon = (severity: Alert["severity"]) => {
    return severity === "CRITICAL" || severity === "HIGH" ? AlertTriangle : CheckCircle;
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Active Alerts
          {activeAlerts.length > 0 && (
            <Badge className="bg-destructive text-destructive-foreground ml-auto">
              {activeAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {activeAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
              <p className="font-medium">All Clear</p>
              <p className="text-sm">No active alerts</p>
            </motion.div>
          ) : (
            activeAlerts.map((alert, index) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === "CRITICAL" ? 
                    "border-l-destructive bg-destructive/5" : 
                    alert.severity === "HIGH" ?
                    "border-l-destructive/80 bg-destructive/5" :
                    alert.severity === "MEDIUM" ?
                    "border-l-warning bg-warning/5" :
                    "border-l-secondary bg-secondary/5"
                  } ${alert.severity === "CRITICAL" ? "animate-surge-pulse" : ""}`}
                >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <SeverityIcon className={`h-4 w-4 ${
                        alert.severity === "CRITICAL" || alert.severity === "HIGH" ? 
                        "text-destructive" : 
                        alert.severity === "MEDIUM" ? 
                        "text-warning" : 
                        "text-secondary"
                      }`} />
                      <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                        {alert.severity}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Alert Message */}
                  <p className="text-sm font-medium mb-2">{alert.message}</p>

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground mb-3">
                    {format(new Date(alert.timestamp), "MMM dd, HH:mm")}
                  </p>

                  {/* Suggestion */}
                  {alert.suggestion && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-2 bg-primary/10 rounded border border-primary/20"
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
                        <ArrowRight className="h-3 w-3" />
                        Suggested Action
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.suggestion.action}: Move {alert.suggestion.teu} TEU from {alert.suggestion.from} to {alert.suggestion.to}
                      </p>
                      <Button size="sm" className="mt-2 h-6 text-xs">
                        Execute Move
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Recently Acknowledged */}
        {acknowledgedAlerts.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Recently Acknowledged ({acknowledgedAlerts.length})
            </p>
            <div className="space-y-1">
              {acknowledgedAlerts.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  className="text-xs p-2 bg-muted/30 rounded flex items-center gap-2"
                >
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span className="truncate">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}