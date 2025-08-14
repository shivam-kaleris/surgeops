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
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-card/95 backdrop-blur-sm shadow-xl border border-border/50">
          <CardHeader className="text-center space-y-3 pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-foreground">
              <Container className="h-7 w-7 text-primary" />
              Yard Block Status
            </CardTitle>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Click blocks for detailed information and move operations
            </p>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            {/* Responsive Grid with Consistent Spacing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 lg:gap-6">
              {blocks.map((block, index) => {
                const StatusIcon = getStatusIcon(block.status);
                const isSelected = selectedBlock === block.id;
                
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full"
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 h-full border-2 shadow-md hover:shadow-lg ${
                        isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-xl border-primary/60 bg-primary/5' : 'border-border/40 hover:border-border/60'
                      } ${block.status === 'critical' ? 'animate-surge-pulse border-destructive/50 bg-destructive/5' : ''}`}
                      onClick={() => handleBlockClick(block)}
                    >
                      <CardContent className="p-4 h-full flex flex-col justify-between min-h-[220px]">
                        {/* Header Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg truncate text-foreground">{block.code}</h3>
                            <StatusIcon className={`h-5 w-5 flex-shrink-0 ${
                              block.status === 'critical' ? 'text-destructive' :
                              block.status === 'warning' ? 'text-warning' : 'text-success'
                            }`} />
                          </div>
                          
                          <div className="flex justify-center">
                            <Badge className={`${getCategoryColor(block.category)} text-sm px-3 py-1 font-medium`} variant="secondary">
                              {block.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Metrics Section */}
                        <div className="space-y-4 flex-1 py-2">
                          {/* Utilization */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground font-medium">Utilization</span>
                              <span className="font-bold text-base">{block.utilization}%</span>
                            </div>
                            <Progress 
                              value={block.utilization} 
                              className="h-3 bg-muted/40"
                            />
                          </div>

                          {/* Capacity */}
                          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground font-medium">Capacity</span>
                              <span className="font-bold text-base">{block.current}/{block.capacity}</span>
                            </div>
                            <div className="text-xs text-muted-foreground text-center mt-1 font-medium">TEU</div>
                          </div>
                        </div>

                        {/* Status Section */}
                        <div className="space-y-3 pt-2">
                          <Badge className={`${getStatusColor(block.status)} w-full justify-center py-2 text-sm font-bold tracking-wide`}>
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
                                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-2 h-9 transition-all duration-200"
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
            <div className="mt-10 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 rounded-xl p-8 border border-border/40 shadow-lg">
                <h3 className="text-center text-xl font-bold mb-6 text-foreground">Status Overview</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-success mb-2">
                      {blocks.filter(b => b.status === 'normal').length}
                    </div>
                    <div className="text-base font-semibold text-muted-foreground">Normal</div>
                  </div>
                  <div className="text-center border-x border-border/40">
                    <div className="text-4xl font-bold text-warning mb-2">
                      {blocks.filter(b => b.status === 'warning').length}
                    </div>
                    <div className="text-base font-semibold text-muted-foreground">Warning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-destructive mb-2">
                      {blocks.filter(b => b.status === 'critical').length}
                    </div>
                    <div className="text-base font-semibold text-muted-foreground">Critical</div>
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
    </div>
  );
}