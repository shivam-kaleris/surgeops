import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, Package, TrendingUp } from "lucide-react";
import type { YardBlock } from "../../lib/mockData";

interface YardBlockModalProps {
  block: YardBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onExecuteMove: () => void;
}

export function YardBlockModal({ block, isOpen, onClose, onExecuteMove }: YardBlockModalProps) {
  if (!block) return null;

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "bg-destructive text-destructive-foreground";
    if (utilization >= 80) return "bg-warning text-warning-foreground";
    if (utilization >= 60) return "bg-primary text-primary-foreground";
    return "bg-success text-success-foreground";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Reefer":
        return Package;
      case "Hazard":
        return TrendingUp;
      default:
        return Container;
    }
  };

  const CategoryIcon = getCategoryIcon(block.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Container className="h-5 w-5 text-primary" />
            Block {block.code} Details
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Category:</span>
            <div className="flex items-center gap-2">
              <CategoryIcon className="h-4 w-4 text-primary" />
              <span className="font-semibold">{block.category}</span>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Capacity:</span>
            <span className="font-semibold text-primary">{block.capacity.toLocaleString()} TEU</span>
          </div>

          {/* Current */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current:</span>
            <span className="font-semibold">{block.current.toLocaleString()} TEU</span>
          </div>

          {/* Utilization */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Utilization:</span>
            <Badge className={getUtilizationColor(block.utilization)}>
              {block.utilization.toFixed(1)}%
            </Badge>
          </div>

          {/* Utilization Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${block.utilization}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-2 rounded-full ${
                  block.utilization >= 90 ? "bg-destructive" :
                  block.utilization >= 80 ? "bg-warning" :
                  block.utilization >= 60 ? "bg-primary" :
                  "bg-success"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onExecuteMove} className="flex-1">
              Execute Move
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}