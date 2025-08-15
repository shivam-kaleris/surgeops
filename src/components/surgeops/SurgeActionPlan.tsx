import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Clock, Users, Ship, Zap, CheckCircle, XCircle, Edit3, RefreshCw, Eye, MapPin } from "lucide-react";
import { DashboardData, YardBlock, Berth } from "../../lib/mockData";

interface SurgeActionPlanProps {
  dashboardData: DashboardData;
  isVisible: boolean;
  onClose: () => void;
}

interface ActionPlan {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  estimatedTime: string;
  impact: string;
  description: string;
  steps: string[];
  resourcesRequired: string[];
  beforeData: {
    berths: Berth[];
    yardBlocks: YardBlock[];
  };
  afterData: {
    berths: Berth[];
    yardBlocks: YardBlock[];
  };
}

type PlanStatus = "analyzing" | "ready" | "editing" | "validating" | "approved" | "rejected";

export function SurgeActionPlan({ dashboardData, isVisible, onClose }: SurgeActionPlanProps) {
  const [planStatus, setPlanStatus] = useState<PlanStatus>("analyzing");
  const [progress, setProgress] = useState(0);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [editedPlan, setEditedPlan] = useState("");
  const [validationFeedback, setValidationFeedback] = useState("");

  // Simulate LLM analysis process
  useEffect(() => {
    if (isVisible && planStatus === "analyzing") {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            generateActionPlan();
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isVisible, planStatus]);

  const generateActionPlan = () => {
    // Mock action plan generation
    const plan: ActionPlan = {
      id: "surge-plan-001",
      title: "High Vessel Congestion Mitigation",
      severity: "high",
      estimatedTime: "4-6 hours",
      impact: "Reduce waiting time by 40%, increase throughput by 25%",
      description: "Implement immediate reallocation of berth assignments and optimize yard block utilization to handle the surge in vessel arrivals.",
      steps: [
        "Reassign 3 vessels from Berth A1-A3 to newly opened Berth B4-B6",
        "Optimize container stacking in Yard Blocks Y1-Y4 to increase capacity by 20%",
        "Deploy additional crane operators to critical berths",
        "Implement priority queuing for time-sensitive cargo",
        "Coordinate with trucking companies for extended pickup hours"
      ],
      resourcesRequired: [
        "2 additional crane operators",
        "1 yard coordinator",
        "Extended trucking shift coordination",
        "Berth reconfiguration team"
      ],
      beforeData: {
        berths: dashboardData.berths,
        yardBlocks: dashboardData.yardBlocks
      },
      afterData: {
        berths: dashboardData.berths.map(berth => {
          // Calculate utilization based on assignments
          const totalTeu = berth.assignments.reduce((sum, assignment) => sum + assignment.vessel.expectedTeu, 0);
          const maxCapacity = 15000; // Assume max berth capacity
          const currentUtilization = (totalTeu / maxCapacity) * 100;
          const improvedUtilization = Math.min(currentUtilization * 0.8, 100);
          
          return {
            ...berth,
            status: berth.status === "Occupied" && improvedUtilization < 70 ? "Available" : berth.status
          };
        }),
        yardBlocks: dashboardData.yardBlocks.map(block => ({
          ...block,
          current: Math.min(block.current * 0.85, block.capacity), // Optimize utilization
          status: (block.current * 0.85) / block.capacity > 0.9 ? "critical" : 
                  (block.current * 0.85) / block.capacity > 0.7 ? "warning" : "normal"
        }))
      }
    };

    setActionPlan(plan);
    setEditedPlan(plan.steps.join('\n'));
    setPlanStatus("ready");
  };

  const handleAccept = () => {
    setPlanStatus("approved");
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleReject = () => {
    setPlanStatus("rejected");
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleEdit = () => {
    setPlanStatus("editing");
  };

  const handleResubmit = async () => {
    setPlanStatus("validating");
    setProgress(0);
    
    // Simulate validation
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setValidationFeedback("Plan validated successfully. Feasibility confirmed with 95% confidence.");
          setPlanStatus("ready");
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 border-destructive/20";
      case "medium": return "bg-warning/10 border-warning/20";
      case "low": return "bg-success/10 border-success/20";
      default: return "bg-muted/10 border-muted/20";
    }
  };

  const renderBeforeAfterComparison = () => {
    if (!actionPlan) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Before State */}
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Current State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Berth Utilization</p>
              <div className="space-y-1">
                {actionPlan.beforeData.berths.slice(0, 3).map(berth => {
                  const totalTeu = berth.assignments.reduce((sum, assignment) => sum + assignment.vessel.expectedTeu, 0);
                  const utilization = Math.min((totalTeu / 15000) * 100, 100);
                  return (
                    <div key={berth.id} className="flex items-center justify-between">
                      <span className="text-xs">{berth.code}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={utilization} className="w-16 h-1.5" />
                        <span className="text-xs text-muted-foreground">{Math.round(utilization)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Yard Density</p>
              <div className="grid grid-cols-4 gap-1">
                {actionPlan.beforeData.yardBlocks.slice(0, 8).map(block => (
                  <div
                    key={block.id}
                    className={`h-6 rounded text-xs flex items-center justify-center text-white font-bold ${
                      block.current / block.capacity > 0.9 ? 'bg-destructive' :
                      block.current / block.capacity > 0.7 ? 'bg-warning' : 'bg-success'
                    }`}
                  >
                    {block.code}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* After State */}
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Projected State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Berth Utilization</p>
              <div className="space-y-1">
                {actionPlan.afterData.berths.slice(0, 3).map(berth => {
                  const totalTeu = berth.assignments.reduce((sum, assignment) => sum + assignment.vessel.expectedTeu, 0);
                  const utilization = Math.min((totalTeu / 15000) * 100, 100);
                  return (
                    <div key={berth.id} className="flex items-center justify-between">
                      <span className="text-xs">{berth.code}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={utilization} className="w-16 h-1.5" />
                        <span className="text-xs text-success">{Math.round(utilization)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Yard Density</p>
              <div className="grid grid-cols-4 gap-1">
                {actionPlan.afterData.yardBlocks.slice(0, 8).map(block => (
                  <div
                    key={block.id}
                    className={`h-6 rounded text-xs flex items-center justify-center text-white font-bold ${
                      block.current / block.capacity > 0.9 ? 'bg-destructive' :
                      block.current / block.capacity > 0.7 ? 'bg-warning' : 'bg-success'
                    }`}
                  >
                    {block.code}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Surge Action Plan
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {planStatus === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Analyzing Current Situation</h3>
                  <p className="text-muted-foreground">Processing berth data, yard utilization, and vessel queue...</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{progress}% Complete</p>
                </div>
              </div>
            </motion.div>
          )}

          {planStatus === "ready" && actionPlan && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Plan Overview */}
              <Card className={`${getSeverityBg(actionPlan.severity)} border`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${getSeverityColor(actionPlan.severity)}`} />
                        {actionPlan.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{actionPlan.description}</p>
                    </div>
                    <Badge className={getSeverityColor(actionPlan.severity)}>
                      {actionPlan.severity.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Est. Time: {actionPlan.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Impact: {actionPlan.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Resources: {actionPlan.resourcesRequired.length} teams</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Implementation Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {actionPlan.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Before/After Comparison */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Impact Visualization</h3>
                {renderBeforeAfterComparison()}
              </div>

              {/* Resource Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Required Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {actionPlan.resourcesRequired.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Ship className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{resource}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {validationFeedback && (
                <Card className="border-success/30 bg-success/5">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <p className="text-sm text-success font-medium">{validationFeedback}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAccept} className="bg-success hover:bg-success/90 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Plan
                </Button>
                <Button onClick={handleEdit} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Update Plan
                </Button>
                <Button onClick={handleReject} variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Plan
                </Button>
              </div>
            </motion.div>
          )}

          {planStatus === "editing" && actionPlan && (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Edit Action Plan</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Modify the implementation steps below. Each line should represent one step.
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editedPlan}
                    onChange={(e) => setEditedPlan(e.target.value)}
                    rows={8}
                    placeholder="Enter implementation steps, one per line..."
                    className="text-sm"
                  />
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={handleResubmit} className="bg-primary hover:bg-primary/90">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resubmit for Validation
                </Button>
                <Button onClick={() => setPlanStatus("ready")} variant="outline">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {planStatus === "validating" && (
            <motion.div
              key="validating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Validating Updated Plan</h3>
                  <p className="text-muted-foreground">Checking feasibility and resource availability...</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{progress}% Complete</p>
                </div>
              </div>
            </motion.div>
          )}

          {(planStatus === "approved" || planStatus === "rejected") && (
            <motion.div
              key={planStatus}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 space-y-4"
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                planStatus === "approved" ? "bg-success/10" : "bg-destructive/10"
              }`}>
                {planStatus === "approved" ? (
                  <CheckCircle className="h-8 w-8 text-success" />
                ) : (
                  <XCircle className="h-8 w-8 text-destructive" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Plan {planStatus === "approved" ? "Approved" : "Rejected"}
                </h3>
                <p className="text-muted-foreground">
                  {planStatus === "approved" 
                    ? "Implementation will begin immediately." 
                    : "Plan has been rejected. You can generate a new plan or try again."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}