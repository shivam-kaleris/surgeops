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
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card shadow-lg border border-border/50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-xl font-bold">
            <Container className="h-6 w-6 text-primary" />
            Yard Block Status
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Click blocks for detailed information and move operations
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {/* Responsive Grid with Consistent Spacing */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {blocks.map((block, index) => {
              const StatusIcon = getStatusIcon(block.status);
              const isSelected = selectedBlock === block.id;
              
              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 h-full border shadow-sm hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary shadow-lg border-primary/50' : 'border-border/30'
                    } ${block.status === 'critical' ? 'animate-surge-pulse border-destructive/30' : ''}`}
                    onClick={() => handleBlockClick(block)}
                  >
                    <CardContent className="p-4 h-full flex flex-col justify-between space-y-3">
                      {/* Header Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg truncate">{block.code}</h3>
                          <StatusIcon className={`h-4 w-4 flex-shrink-0 ${
                            block.status === 'critical' ? 'text-destructive' :
                            block.status === 'warning' ? 'text-warning' : 'text-success'
                          }`} />
                        </div>
                        
                        <div className="flex justify-center">
                          <Badge className={`${getCategoryColor(block.category)} text-xs px-2 py-1`} variant="secondary">
                            {block.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Metrics Section */}
                      <div className="space-y-3 flex-1">
                        {/* Utilization */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Utilization</span>
                            <span className="font-semibold">{block.utilization}%</span>
                          </div>
                          <Progress 
                            value={block.utilization} 
                            className="h-2 bg-muted/50"
                          />
                        </div>

                        {/* Capacity */}
                        <div className="bg-muted/20 rounded-md p-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Capacity</span>
                            <span className="font-semibold">{block.current}/{block.capacity}</span>
                          </div>
                          <div className="text-xs text-muted-foreground text-center mt-1">TEU</div>
                        </div>
                      </div>

                      {/* Status Section */}
                      <div className="space-y-2">
                        <Badge className={`${getStatusColor(block.status)} w-full justify-center py-2 text-xs font-medium`}>
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
                              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs py-2"
                            >
                              Execute Move
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Stats - Centered */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-6 border border-border/30 shadow-sm">
              <h3 className="text-center text-lg font-semibold mb-4 text-foreground">Status Overview</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-1">
                    {blocks.filter(b => b.status === 'normal').length}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Normal</div>
                </div>
                <div className="text-center border-x border-border/30">
                  <div className="text-3xl font-bold text-warning mb-1">
                    {blocks.filter(b => b.status === 'warning').length}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive mb-1">
                    {blocks.filter(b => b.status === 'critical').length}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Critical</div>
                </div>
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
    </div>
  );
}