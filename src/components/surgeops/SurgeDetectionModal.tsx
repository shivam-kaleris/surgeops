import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  X,
  MapPin,
  Container
} from "lucide-react";

interface SurgeDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  surgeData: {
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    riskScore: number;
    affectedBlocks: string[];
    suggestedActions: Array<{
      action: string;
      from: string;
      to: string;
      teu: number;
      priority: "HIGH" | "MEDIUM" | "LOW";
    }>;
    eta: string;
    weatherImpact: string;
  } | null;
}

export function SurgeDetectionModal({ isOpen, onClose, surgeData }: SurgeDetectionModalProps) {
  if (!surgeData) return null;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return {
          color: "bg-red-500 text-white",
          bgColor: "bg-red-50 border-red-200",
          textColor: "text-red-700",
          icon: AlertTriangle
        };
      case "HIGH":
        return {
          color: "bg-orange-500 text-white",
          bgColor: "bg-orange-50 border-orange-200",
          textColor: "text-orange-700",
          icon: AlertTriangle
        };
      case "MEDIUM":
        return {
          color: "bg-yellow-500 text-white",
          bgColor: "bg-yellow-50 border-yellow-200",
          textColor: "text-yellow-700",
          icon: TrendingUp
        };
      default:
        return {
          color: "bg-blue-500 text-white",
          bgColor: "bg-blue-50 border-blue-200",
          textColor: "text-blue-700",
          icon: TrendingUp
        };
    }
  };

  const config = getSeverityConfig(surgeData.severity);
  const SeverityIcon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <SeverityIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold">Surge Detection Alert</span>
              <Badge className={`ml-3 ${config.color}`}>
                {surgeData.severity} RISK
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Risk Overview */}
          <Card className={`border-2 ${config.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Risk Assessment</h3>
                <span className={`text-2xl font-bold ${config.textColor}`}>
                  {surgeData.riskScore}%
                </span>
              </div>
              
              <Progress 
                value={surgeData.riskScore} 
                className="h-3 mb-3"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">ETA Impact: {surgeData.eta}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Weather: {surgeData.weatherImpact}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affected Areas */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Container className="h-4 w-4" />
              Affected Yard Blocks
            </h3>
            <div className="flex flex-wrap gap-2">
              {surgeData.affectedBlocks.map((block) => (
                <Badge key={block} variant="outline" className="px-3 py-1">
                  Block {block}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Recommended Actions
            </h3>
            
            <div className="space-y-3">
              {surgeData.suggestedActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-lg p-4 border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={action.priority === "HIGH" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {action.priority}
                      </Badge>
                      <span className="font-medium text-sm">{action.action}</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {action.teu.toLocaleString()} TEU
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>Move from <strong>{action.from}</strong></span>
                    <ArrowRight className="h-3 w-3" />
                    <span>to <strong>{action.to}</strong></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reject Plan
            </Button>
            <Button 
              onClick={() => {
                // Handle accept action
                console.log("Surge action plan accepted");
                onClose();
              }}
              className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="h-4 w-4" />
              Accept & Execute
            </Button>
          </div>

          {/* Emergency Contact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                For immediate assistance, contact Port Control: +65 6325 2488
              </span>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}