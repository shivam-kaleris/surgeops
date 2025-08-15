import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Activity, Ship, Cloud, AlertTriangle, Settings, TrendingUp, ChevronDown, ChevronUp, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import type { Event } from "../../lib/mockData";

interface EventsPanelProps {
  events: Event[];
  onClearEvent?: (eventId: string) => void;
  onClearAll?: () => void;
}

export function EventsPanel({ events, onClearEvent, onClearAll }: EventsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
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
    <Card className="bg-card shadow-card border-0 hover:shadow-glow transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Events
                {events.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {events.length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {events.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearAll?.();
                    }}
                    className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Live system activity feed
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto pt-0">
            {events.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-sm">No Recent Events</p>
                <p className="text-xs">System activity will appear here</p>
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
                    className="flex items-start gap-3 p-2 bg-gradient-depth rounded-lg hover:shadow-card transition-all duration-200 group"
                  >
                    {/* Event Icon */}
                    <div className={`p-1.5 rounded-full bg-muted/30`}>
                      <EventIcon className={`h-3 w-3 ${getEventColor(event.type)}`} />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0">
                      {/* Event Header */}
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(event.severity)} variant="secondary">
                          {event.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {format(new Date(event.timestamp), "HH:mm")}
                        </span>
                      </div>

                      {/* Event Message */}
                      <p className="text-xs font-medium leading-relaxed">
                        {event.message}
                      </p>
                    </div>

                    {/* Clear Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearEvent?.(event.id);
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    {/* Severity Indicator */}
                    <div className={`w-2 h-2 rounded-full mt-1 ${
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
              <div className="pt-2 text-center">
                <button className="text-xs text-primary hover:text-primary/80 font-medium">
                  View All Events
                </button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}