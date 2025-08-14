import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Ship, Cloud, AlertTriangle, Settings, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "../../lib/mockData";

interface EventsPanelProps {
  events: Event[];
}

export function EventsPanel({ events }: EventsPanelProps) {
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "vessel":
        return Ship;
      case "weather":
        return Cloud;
      case "surge":
        return TrendingUp;
      case "reroute":
        return AlertTriangle;
      case "system":
        return Settings;
      default:
        return Activity;
    }
  };

  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "vessel":
        return "text-primary";
      case "weather":
        return "text-accent";
      case "surge":
        return "text-warning";
      case "reroute":
        return "text-destructive";
      case "system":
        return "text-muted-foreground";
      default:
        return "text-foreground";
    }
  };

  const getSeverityColor = (severity: Event["severity"]) => {
    switch (severity) {
      case "error":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "info":
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Activity className="h-5 w-5 text-primary" />
          Recent Events
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Live system activity feed
        </p>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No Recent Events</p>
            <p className="text-sm">System activity will appear here</p>
          </div>
        ) : (
          events.map((event, index) => {
            const EventIcon = getEventIcon(event.type);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-gradient-depth rounded-lg hover:shadow-card transition-all duration-200"
              >
                {/* Event Icon */}
                <div className={`p-2 rounded-full bg-muted/30`}>
                  <EventIcon className={`h-4 w-4 ${getEventColor(event.type)}`} />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  {/* Event Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getSeverityColor(event.severity)} variant="secondary">
                      {event.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.timestamp), "HH:mm")}
                    </span>
                  </div>

                  {/* Event Message */}
                  <p className="text-sm font-medium leading-relaxed">
                    {event.message}
                  </p>

                  {/* Event Timestamp */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(event.timestamp), "MMM dd, yyyy")}
                  </p>
                </div>

                {/* Severity Indicator */}
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  event.severity === "error" ? "bg-destructive" :
                  event.severity === "warning" ? "bg-warning" :
                  "bg-primary"
                }`} />
              </motion.div>
            );
          })
        )}

        {/* Load More */}
        {events.length > 0 && (
          <div className="pt-3 text-center">
            <button className="text-xs text-primary hover:text-primary/80 font-medium">
              View All Events
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}