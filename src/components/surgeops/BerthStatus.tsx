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
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card shadow-lg border border-border/50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-xl font-bold">
            <Anchor className="h-6 w-6 text-primary" />
            Berth Status & Assignments
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Multiple vessels can be assigned per berth (planned/actual)
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {/* Horizontal Berth Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {berths.map((berth, index) => {
              const isSelected = selectedBerth === berth.id;
              
              return (
                <motion.div
                  key={berth.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 h-full border shadow-sm hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary shadow-lg border-primary/50' : 
                      berth.status === 'Occupied' ? 'border-destructive/30 hover:border-destructive/50' :
                      berth.status === 'Available' ? 'border-success/30 hover:border-success/50' :
                      'border-border/30 hover:border-primary/30'
                    }`}
                    onClick={() => onBerthSelect(berth.id)}
                  >
                    <CardContent className="p-5 h-full flex flex-col">
                      {/* Berth Header */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{berth.code}</h3>
                          <Badge className={`${getStatusColor(berth.status)} px-3 py-1 text-sm`}>
                            {berth.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{berth.assignments.length}</span>
                        </div>
                      </div>

                      {/* Vessel Assignments */}
                      <div className="flex-1 space-y-3">
                        {berth.assignments.length === 0 ? (
                          <div className="flex items-center justify-center py-8 text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted/30">
                            <div className="text-center">
                              <Ship className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No vessels assigned</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                            {berth.assignments.map((assignment, aIndex) => (
                              <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: aIndex * 0.1 }}
                                className="border border-border/40 rounded-lg p-4 bg-gradient-to-r from-card/50 to-muted/10 shadow-sm"
                              >
                                {/* Vessel Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Ship className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-sm truncate">{assignment.vessel.name}</span>
                                  </div>
                                  <Badge className={`${getVesselStatusColor(assignment.vessel.status)} text-xs px-2 py-1`}>
                                    {assignment.vessel.status}
                                  </Badge>
                                </div>

                                {/* Vessel Details Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div className="bg-muted/20 rounded-md p-2">
                                    <div className="text-xs text-muted-foreground mb-1">IMO</div>
                                    <div className="font-mono text-sm font-medium">{assignment.vessel.imo}</div>
                                  </div>
                                  <div className="bg-muted/20 rounded-md p-2">
                                    <div className="text-xs text-muted-foreground mb-1">Expected TEU</div>
                                    <div className="text-sm font-medium">{assignment.vessel.expectedTeu.toLocaleString()}</div>
                                  </div>
                                </div>

                                {/* Timing Information */}
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-center gap-2 p-2 bg-muted/10 rounded-md">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground font-medium">Planned:</span>
                                    <span className="font-medium">
                                      {format(new Date(assignment.plannedStart), "MMM dd")} - {format(new Date(assignment.plannedEnd), "MMM dd")}
                                    </span>
                                  </div>
                                  
                                  {assignment.actualStart && (
                                    <div className="flex items-center gap-2 p-2 bg-success/10 rounded-md border border-success/20">
                                      <span className="text-success font-medium">Started:</span>
                                      <span className="text-success">{format(new Date(assignment.actualStart), "MMM dd, HH:mm")}</span>
                                    </div>
                                  )}
                                  
                                  {assignment.actualEnd && (
                                    <div className="flex items-center gap-2 p-2 bg-success/10 rounded-md border border-success/20">
                                      <span className="text-success font-medium">Completed:</span>
                                      <span className="text-success">{format(new Date(assignment.actualEnd), "MMM dd, HH:mm")}</span>
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
                          className="mt-4 pt-4 border-t border-border/30"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <Button size="sm" variant="outline" className="text-sm py-2">
                              View Details
                            </Button>
                            <Button size="sm" className="text-sm py-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}