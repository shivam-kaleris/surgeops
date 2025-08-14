import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Anchor, Ship, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import type { Berth } from "../../lib/mockData";

interface BerthStatusProps {
  berths: Berth[];
  onBerthSelect: (berthId: string) => void;
  selectedBerth: string | null;
}

export function BerthStatus({ berths, onBerthSelect, selectedBerth }: BerthStatusProps) {
  const getStatusColor = (status: Berth["status"]) => {
    switch (status) {
      case "Occupied":
        return "bg-destructive text-destructive-foreground";
      case "Maintenance":
        return "bg-warning text-warning-foreground";
      case "Available":
      default:
        return "bg-success text-success-foreground";
    }
  };

  const getVesselStatusColor = (status: string) => {
    switch (status) {
      case "Loading":
        return "bg-warning text-warning-foreground";
      case "Berthing":
        return "bg-primary text-primary-foreground";
      case "Waiting":
        return "bg-secondary text-secondary-foreground";
      case "Departed":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Anchor className="h-5 w-5 text-primary" />
          Berth Status & Assignments
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Multiple vessels can be assigned per berth (planned/actual)
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {berths.map((berth, index) => {
            const isSelected = selectedBerth === berth.id;
            
            return (
              <motion.div
                key={berth.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-depth ${
                    isSelected ? 'ring-2 ring-primary shadow-glow' : 
                    berth.status === 'Occupied' ? 'border-destructive/50 hover:border-destructive' :
                    berth.status === 'Available' ? 'border-success/50 hover:border-success' :
                    'hover:border-primary/50'
                  }`}
                  onClick={() => onBerthSelect(berth.id)}
                >
                  <CardContent className="p-3">
                    {/* Berth Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">{berth.code}</h3>
                        <Badge className={`${getStatusColor(berth.status)} text-xs px-1 py-0`}>
                          {berth.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {berth.assignments.length}
                      </div>
                    </div>

                    {/* Vessel Assignments - Horizontal scroll for multiple vessels */}
                    <div className="space-y-2">
                      {berth.assignments.length === 0 ? (
                        <div className="text-center py-2 text-xs text-muted-foreground">
                          No vessels
                        </div>
                      ) : (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {berth.assignments.map((assignment, aIndex) => (
                            <motion.div
                              key={assignment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: aIndex * 0.1 }}
                              className="border rounded-md p-2 bg-gradient-depth min-w-[180px] flex-shrink-0"
                            >
                              {/* Vessel Info */}
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                  <Ship className="h-3 w-3 text-primary" />
                                  <span className="font-medium text-xs truncate">{assignment.vessel.name}</span>
                                </div>
                                <Badge className={`${getVesselStatusColor(assignment.vessel.status)} text-xs px-1 py-0`}>
                                  {assignment.vessel.status}
                                </Badge>
                              </div>

                              {/* Vessel Details */}
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">IMO:</span>
                                  <span className="font-mono text-xs">{assignment.vessel.imo}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">TEU:</span>
                                  <span className="font-medium">{assignment.vessel.expectedTeu.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Timing */}
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-1 text-xs">
                                  <Clock className="h-2 w-2 text-muted-foreground" />
                                  <span className="text-muted-foreground">Planned:</span>
                                </div>
                                <div className="text-xs font-medium">
                                  {format(new Date(assignment.plannedStart), "MMM dd")} - 
                                  {format(new Date(assignment.plannedEnd), "MMM dd")}
                                </div>
                                
                                {assignment.actualStart && (
                                  <div className="text-xs text-success">
                                    Started: {format(new Date(assignment.actualStart), "MMM dd, HH:mm")}
                                  </div>
                                )}
                                
                                {assignment.actualEnd && (
                                  <div className="text-xs text-success">
                                    Completed: {format(new Date(assignment.actualEnd), "MMM dd, HH:mm")}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t"
                      >
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                            Details
                          </Button>
                          <Button size="sm" className="flex-1 text-xs h-7">
                            Schedule
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}