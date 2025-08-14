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
        return "text-destructive";
      case "warning":
        return "text-warning";
      case "normal":
      default:
        return "text-success";
    }
  };

  const handleBlockClick = (block: YardBlock) => {
    setSelectedBlockData(block);
    setModalOpen(true);
    onBlockSelect(block.code);
  };

  return (
    <div className="w-full">
      <Card className="bg-card border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Container className="h-5 w-5 text-foreground" />
            <CardTitle className="text-lg font-semibold">Yard Status</CardTitle>
            <Badge variant="secondary" className="ml-auto text-xs">Live Updates</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Horizontal Row Layout */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-48"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 border-2 h-full ${
                    selectedBlock === block.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleBlockClick(block)}
                >
                  <CardContent className="p-4">
                    {/* Block Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{block.code}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{block.category}</span>
                    </div>

                    {/* Capacity Info */}
                    <div className="text-center mb-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        {block.current} / {block.capacity} TEU
                      </div>
                      <Progress 
                        value={block.utilization} 
                        className="h-2"
                      />
                    </div>

                    {/* Utilization */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {block.utilization}%
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(block.status)}`}>
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        {block.status === 'normal' ? 'Low' : block.status === 'warning' ? 'Medium' : 'High'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Status Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Low (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Medium (60-80%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">High (80-95%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
              <span className="text-muted-foreground">Critical (&gt;95%)</span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Optimize Layout →
            </Button>
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