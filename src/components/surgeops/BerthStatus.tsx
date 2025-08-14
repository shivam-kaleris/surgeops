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
        return "bg-destructive";
      case "Maintenance":
        return "bg-warning";
      case "Available":
      default:
        return "bg-success";
    }
  };

  const getVesselStatusColor = (status: string) => {
    switch (status) {
      case "Loading":
        return "text-warning";
      case "Berthing":
        return "text-primary";
      case "Waiting":
        return "text-secondary";
      case "Departed":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="w-full mt-6">
      <Card className="bg-card border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Anchor className="h-5 w-5 text-foreground" />
              <CardTitle className="text-lg font-semibold">Berth Status</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">{berths.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-semibold text-success">{berths.filter(b => b.status === 'Available').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Occupied:</span>
                <span className="font-semibold text-destructive">{berths.filter(b => b.status === 'Occupied').length}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Horizontal scrollable berths */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {berths.map((berth, index) => (
              <motion.div
                key={berth.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[280px] flex-shrink-0"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 border-2 h-full ${
                    selectedBerth === berth.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onBerthSelect(berth.id)}
                >
                  <CardContent className="p-4">
                    {/* Berth Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-lg">{berth.code}</div>
                        <Badge variant="secondary" className={`${getStatusColor(berth.status)} text-white text-xs px-2 py-1`}>
                          {berth.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">
                      {berth.assignments.reduce((sum, a) => sum + a.vessel.expectedTeu, 0).toLocaleString()} TEU
                    </div>

                    <div className="w-full bg-border rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(berth.status)} transition-all duration-300`}
                        style={{ width: `${berth.status === 'Occupied' ? 100 : berth.status === 'Available' ? 0 : 50}%` }}
                      />
                    </div>

                    {/* Assigned Vessels */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Users className="h-3 w-3" />
                      <span>Vessels ({berth.assignments.length})</span>
                    </div>

                    {berth.assignments.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <Ship className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No vessels assigned</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {berth.assignments.slice(0, 2).map((assignment) => (
                          <div
                            key={assignment.id}
                            className="border border-border rounded-lg p-2 bg-muted/20"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <Ship className="h-3 w-3 text-primary" />
                                <span className="font-semibold text-xs truncate">{assignment.vessel.name}</span>
                              </div>
                              <Badge variant="outline" className={`text-xs ${getVesselStatusColor(assignment.vessel.status)}`}>
                                {assignment.vessel.status}
                              </Badge>
                            </div>
                            
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">TEU: {assignment.vessel.expectedTeu.toLocaleString()}</span>
                              <span className="text-muted-foreground">
                                ETA: {format(new Date(assignment.plannedStart), "MMM dd")}
                              </span>
                            </div>
                          </div>
                        ))}
                        {berth.assignments.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{berth.assignments.length - 2} more vessels
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}