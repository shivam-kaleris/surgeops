import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar";
import { SurgeDetectionModal } from "./SurgeDetectionModal";
import { DashboardKPIs } from "./DashboardKPIs";
import { UtilizationChart } from "./UtilizationChart";
import { YardGrid } from "./YardGrid";
import { BerthStatus } from "./BerthStatus";
import { WeatherCard } from "./WeatherCard";
import { AlertsPanel } from "./AlertsPanel";
import { EventsPanel } from "./EventsPanel";
import { SurgeOpsChat } from "./SurgeOpsChat";
import { TestPanel } from "./TestPanel";
import { mockData } from "../../lib/mockData";

export function SurgeOpsDashboard() {
  const [dashboardData, setDashboardData] = useState(mockData.getDashboardData());
  const [selectedYardBlock, setSelectedYardBlock] = useState<string | null>(null);
  const [selectedBerth, setSelectedBerth] = useState<string | null>(null);
  const [surgeModalOpen, setSurgeModalOpen] = useState(false);
  const [surgeData, setSurgeData] = useState<any>(null);

  // Simulate real-time updates and surge detection
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(mockData.getDashboardData());
      
      // Simulate surge detection (10% chance every update)
      if (Math.random() < 0.1) {
        setSurgeData({
          severity: ["MEDIUM", "HIGH", "CRITICAL"][Math.floor(Math.random() * 3)],
          riskScore: 75 + Math.floor(Math.random() * 25),
          affectedBlocks: ["B1", "B2", "B3"].slice(0, Math.floor(Math.random() * 3) + 1),
          suggestedActions: [
            {
              action: "Emergency Relocation",
              from: "B1",
              to: "B4",
              teu: 150,
              priority: "HIGH" as const
            },
            {
              action: "Load Balancing",
              from: "B2", 
              to: "B5",
              teu: 200,
              priority: "MEDIUM" as const
            }
          ],
          eta: "2 hours",
          weatherImpact: "High winds expected"
        });
        setSurgeModalOpen(true);
      }
    }, 8000); // Check every 8 seconds for demo
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Operations Dashboard</h1>
                  <p className="text-sm text-slate-600">Real-time port management system</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour12: false,
                      timeZoneName: 'short'
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  OPERATIONAL
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {/* KPIs Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DashboardKPIs data={dashboardData.kpis} />
            </motion.div>

            {/* Chart + Monitoring Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8"
              >
                <UtilizationChart data={dashboardData.chartData} />
              </motion.div>
              
              <div className="lg:col-span-4 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <WeatherCard weather={dashboardData.weather} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AlertsPanel alerts={dashboardData.alerts} />
                </motion.div>
              </div>
            </div>

            {/* Operations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-8"
              >
                <YardGrid 
                  blocks={dashboardData.yardBlocks}
                  onBlockSelect={setSelectedYardBlock}
                  selectedBlock={selectedYardBlock}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-4"
              >
                <BerthStatus 
                  berths={dashboardData.berths}
                  onBerthSelect={setSelectedBerth}
                  selectedBerth={selectedBerth}
                />
              </motion.div>
            </div>

            {/* Control Panels Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <EventsPanel events={dashboardData.events} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <SurgeOpsChat />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <TestPanel onSimulate={(type, magnitude) => {
                  console.log(`Simulating ${type} with magnitude ${magnitude}`);
                  if (type === "surge") {
                    setSurgeData({
                      severity: magnitude > 0.7 ? "CRITICAL" : magnitude > 0.5 ? "HIGH" : "MEDIUM",
                      riskScore: Math.floor(magnitude * 100),
                      affectedBlocks: ["B1", "B2"],
                      suggestedActions: [
                        {
                          action: "Emergency Relocation",
                          from: "B1",
                          to: "B4",
                          teu: Math.floor(magnitude * 300),
                          priority: "HIGH" as const
                        }
                      ],
                      eta: "1 hour",
                      weatherImpact: "Simulated conditions"
                    });
                    setSurgeModalOpen(true);
                  }
                  setDashboardData(mockData.getDashboardData());
                }} />
              </motion.div>
            </div>
          </main>
        </div>

        {/* Surge Detection Modal */}
        <SurgeDetectionModal
          isOpen={surgeModalOpen}
          onClose={() => setSurgeModalOpen(false)}
          surgeData={surgeData}
        />
      </div>
    </SidebarProvider>
  );
}