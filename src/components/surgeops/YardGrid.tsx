import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { YardBlockModal } from "./YardBlockModal";
import { Container, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { YardBlock } from "../../lib/mockData";

interface YardGridProps {
  blocks: YardBlock[];
  onBlockSelect: (blockId: string) => void;
  selectedBlock: string | null;
}

export function YardGrid({ blocks, onBlockSelect, selectedBlock }: YardGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlockData, setSelectedBlockData] = useState<YardBlock | null>(null);
  const getStatusColor = (status: YardBlock["status"]) => {
    switch (status) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "normal":
      default:
        return "bg-success text-success-foreground";
    }
  };

  const getStatusIcon = (status: YardBlock["status"]) => {
    switch (status) {
      case "critical":
        return AlertTriangle;
      case "warning":
        return AlertTriangle;
      case "normal":
      default:
        return CheckCircle;
    }
  };

  const getCategoryColor = (category: YardBlock["category"]) => {
    switch (category) {
      case "Reefer":
        return "bg-accent text-accent-foreground";
      case "Hazard":
        return "bg-secondary text-secondary-foreground";
      case "Standard":
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const handleBlockClick = (block: YardBlock) => {
    setSelectedBlockData(block);
    setModalOpen(true);
    onBlockSelect(block.code);
  };

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Container className="h-5 w-5 text-primary" />
          Yard Block Status
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click blocks for detailed information and move operations
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {blocks.map((block, index) => {
            const StatusIcon = getStatusIcon(block.status);
            const isSelected = selectedBlock === block.id;
            
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-depth ${
                    isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                  } ${block.status === 'critical' ? 'animate-surge-pulse' : ''}`}
                  onClick={() => handleBlockClick(block)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{block.code}</h3>
                        <StatusIcon className={`h-4 w-4 ${
                          block.status === 'critical' ? 'text-destructive' :
                          block.status === 'warning' ? 'text-warning' : 'text-success'
                        }`} />
                      </div>
                      <Badge className={getCategoryColor(block.category)} variant="secondary">
                        {block.category}
                      </Badge>
                    </div>

                    {/* Utilization */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Utilization</span>
                        <span className="font-medium">{block.utilization}%</span>
                      </div>
                      <Progress 
                        value={block.utilization} 
                        className="h-2"
                        style={{
                          background: `hsl(var(--muted))`,
                        }}
                      />
                    </div>

                    {/* Capacity */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{block.current}/{block.capacity} TEU</span>
                    </div>

                    {/* Status Badge */}
                    <Badge className={`${getStatusColor(block.status)} w-full justify-center`}>
                      {block.status.toUpperCase()}
                    </Badge>

                    {/* Critical Actions */}
                    {block.status === 'critical' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button 
                          size="sm" 
                          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Execute Move
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gradient-depth rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                {blocks.filter(b => b.status === 'normal').length}
              </div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {blocks.filter(b => b.status === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warning</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {blocks.filter(b => b.status === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <YardBlockModal
        block={selectedBlockData}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onExecuteMove={() => {
          console.log('Execute move for block:', selectedBlockData?.code);
          setModalOpen(false);
        }}
      />
    </Card>
  );
}