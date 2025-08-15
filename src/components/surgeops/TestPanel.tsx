import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FlaskConical, Zap, Cloud, AlertTriangle, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

interface TestPanelProps {
  onSimulate: (type: string, magnitude: number) => void;
  onSurgeActionPlan?: () => void;
}

export function TestPanel({ onSimulate, onSurgeActionPlan }: TestPanelProps) {
  const [surgeMagnitude, setSurgeMagnitude] = useState([0.3]);
  const [selectedRegion, setSelectedRegion] = useState("red-sea");
  const [selectedSeverity, setSelectedSeverity] = useState("HIGH");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSimulateSurge = () => {
    setIsSimulating(true);
    onSimulate("surge", surgeMagnitude[0]);
    
    // Trigger the surge action plan
    setTimeout(() => {
      setIsSimulating(false);
      if (onSurgeActionPlan) {
        onSurgeActionPlan();
      }
    }, 2000);
  };

  const handleRerouteSignal = () => {
    onSimulate("reroute", 0.5);
  };

  const handleWeatherEvent = () => {
    onSimulate("weather", 0.7);
  };

  const regions = [
    { value: "red-sea", label: "Red Sea" },
    { value: "suez-canal", label: "Suez Canal" },
    { value: "panama-canal", label: "Panama Canal" },
    { value: "strait-malacca", label: "Strait of Malacca" }
  ];

  const severities = [
    { value: "LOW", color: "bg-success text-success-foreground" },
    { value: "MEDIUM", color: "bg-warning text-warning-foreground" },
    { value: "HIGH", color: "bg-destructive text-destructive-foreground" },
    { value: "CRITICAL", color: "bg-slate-900 text-white border-slate-800" }
  ];

  return (
    <Card className="bg-card shadow-card border-0 hover:shadow-glow transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-secondary" />
                Crisis Simulation
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Test surge prediction and response systems
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Surge Simulation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                <h4 className="font-medium">Surge Simulation</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Magnitude: {Math.round(surgeMagnitude[0] * 100)}%
                  </label>
                  <Slider
                    value={surgeMagnitude}
                    onValueChange={setSurgeMagnitude}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <Button
                  onClick={handleSimulateSurge}
                  disabled={isSimulating}
                  className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-warning-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Trigger Surge
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Reroute Signal */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h4 className="font-medium">Reroute Signal</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Severity</label>
                  <div className="grid grid-cols-2 gap-2">
                    {severities.map((severity) => (
                      <Badge
                        key={severity.value}
                        className={`cursor-pointer transition-all text-center justify-center ${
                          selectedSeverity === severity.value 
                            ? severity.color 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        onClick={() => setSelectedSeverity(severity.value)}
                      >
                        {severity.value}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={handleRerouteSignal}
                  variant="destructive"
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Inject Reroute Signal
                </Button>
              </div>
            </div>

            {/* Weather Event */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-accent" />
                <h4 className="font-medium">Weather Event</h4>
              </div>
              
              <Button
                onClick={handleWeatherEvent}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Simulate Storm
              </Button>
            </div>

            {/* Reset */}
            <div className="pt-3 border-t">
              <Button
                onClick={() => onSimulate("reset", 0)}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Simulations
              </Button>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">System Status</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>AI Models: Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Data Feeds: Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                  <span>Alerts: {isSimulating ? "Processing" : "Ready"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>SSE: Connected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}