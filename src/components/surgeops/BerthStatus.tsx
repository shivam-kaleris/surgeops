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
        return "bg-warning text-warning-foreground";
      case "Maintenance":
        return "bg-destructive text-destructive-foreground";
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
      <CardContent className="space-y-4">
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
                  isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
                onClick={() => onBerthSelect(berth.id)}
              >
                <CardContent className="p-4">
                  {/* Berth Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{berth.code}</h3>
                      <Badge className={getStatusColor(berth.status)}>
                        {berth.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {berth.assignments.length} vessels
                    </div>
                  </div>

                  {/* Vessel Assignments */}
                  <div className="space-y-3">
                    {berth.assignments.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No vessels assigned
                      </div>
                    ) : (
                      berth.assignments.map((assignment, aIndex) => (
                        <motion.div
                          key={assignment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: aIndex * 0.1 }}
                          className="border rounded-lg p-3 bg-gradient-depth"
                        >
                          {/* Vessel Info */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Ship className="h-4 w-4 text-primary" />
                              <span className="font-medium">{assignment.vessel.name}</span>
                            </div>
                            <Badge className={getVesselStatusColor(assignment.vessel.status)}>
                              {assignment.vessel.status}
                            </Badge>
                          </div>

                          {/* Vessel Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">IMO:</span>
                              <span className="ml-2 font-mono">{assignment.vessel.imo}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expected TEU:</span>
                              <span className="ml-2 font-medium">{assignment.vessel.expectedTeu.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Timing */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Planned:</span>
                              <span className="font-medium">
                                {format(new Date(assignment.plannedStart), "MMM dd, HH:mm")} - 
                                {format(new Date(assignment.plannedEnd), "MMM dd, HH:mm")}
                              </span>
                            </div>
                            
                            {assignment.actualStart && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-success font-medium">Actual Start:</span>
                                <span>{format(new Date(assignment.actualStart), "MMM dd, HH:mm")}</span>
                              </div>
                            )}
                            
                            {assignment.actualEnd && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-success font-medium">Completed:</span>
                                <span>{format(new Date(assignment.actualEnd), "MMM dd, HH:mm")}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          Schedule Vessel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}