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
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-card/95 backdrop-blur-sm shadow-xl border border-border/50">
          <CardHeader className="text-center space-y-3 pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-foreground">
              <Anchor className="h-7 w-7 text-primary" />
              Berth Status & Assignments
            </CardTitle>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Multiple vessels can be assigned per berth (planned/actual)
            </p>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
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
                      className={`cursor-pointer transition-all duration-300 h-full border-2 shadow-md hover:shadow-lg ${
                        isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-xl border-primary/60 bg-primary/5' : 
                        berth.status === 'Occupied' ? 'border-destructive/40 hover:border-destructive/60 bg-destructive/5' :
                        berth.status === 'Available' ? 'border-success/40 hover:border-success/60 bg-success/5' :
                        'border-border/40 hover:border-border/60'
                      }`}
                      onClick={() => onBerthSelect(berth.id)}
                    >
                      <CardContent className="p-6 h-full flex flex-col min-h-[400px]">
                        {/* Berth Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-xl text-foreground">{berth.code}</h3>
                            <Badge className={`${getStatusColor(berth.status)} px-3 py-1 text-sm font-semibold`}>
                              {berth.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg border border-border/30">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">{berth.assignments.length} vessels</span>
                          </div>
                        </div>

                        {/* Vessel Assignments */}
                        <div className="flex-1 space-y-4">
                          {berth.assignments.length === 0 ? (
                            <div className="flex items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed border-muted/40">
                              <div className="text-center">
                                <Ship className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="text-base font-medium">No vessels assigned</p>
                                <p className="text-sm mt-1">This berth is available for scheduling</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-muted/60">
                              {berth.assignments.map((assignment, aIndex) => (
                                <motion.div
                                  key={assignment.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: aIndex * 0.1 }}
                                  className="border-2 border-border/50 rounded-xl p-5 bg-gradient-to-br from-card/80 to-muted/20 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                  {/* Vessel Header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <Ship className="h-5 w-5 text-primary" />
                                      <span className="font-bold text-base text-foreground truncate">{assignment.vessel.name}</span>
                                    </div>
                                    <Badge className={`${getVesselStatusColor(assignment.vessel.status)} text-sm px-3 py-1 font-semibold`}>
                                      {assignment.vessel.status}
                                    </Badge>
                                  </div>

                                  {/* Vessel Details Grid */}
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                                      <div className="text-xs text-muted-foreground font-medium mb-1">IMO Number</div>
                                      <div className="font-mono text-sm font-bold text-foreground">{assignment.vessel.imo}</div>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                                      <div className="text-xs text-muted-foreground font-medium mb-1">Expected TEU</div>
                                      <div className="text-sm font-bold text-foreground">{assignment.vessel.expectedTeu.toLocaleString()}</div>
                                    </div>
                                  </div>

                                  {/* Timing Information */}
                                  <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <div className="flex-1">
                                        <span className="text-muted-foreground font-medium">Planned Schedule:</span>
                                        <div className="font-semibold text-foreground mt-1">
                                          {format(new Date(assignment.plannedStart), "MMM dd, HH:mm")} - {format(new Date(assignment.plannedEnd), "MMM dd, HH:mm")}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {assignment.actualStart && (
                                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/30">
                                        <div className="w-3 h-3 bg-success rounded-full" />
                                        <div className="flex-1">
                                          <span className="text-success font-semibold">Actual Start:</span>
                                          <div className="text-success font-medium">{format(new Date(assignment.actualStart), "MMM dd, HH:mm")}</div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {assignment.actualEnd && (
                                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/30">
                                        <div className="w-3 h-3 bg-success rounded-full" />
                                        <div className="flex-1">
                                          <span className="text-success font-semibold">Completed:</span>
                                          <div className="text-success font-medium">{format(new Date(assignment.actualEnd), "MMM dd, HH:mm")}</div>
                                        </div>
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
                            className="mt-6 pt-4 border-t border-border/40"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <Button 
                                size="default" 
                                variant="outline" 
                                className="font-semibold py-3 h-11 border-2 hover:bg-muted/50 transition-all duration-200"
                              >
                                View Details
                              </Button>
                              <Button 
                                size="default" 
                                className="font-semibold py-3 h-11 bg-primary hover:bg-primary/90 transition-all duration-200"
                              >
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
    </div>
  );
}