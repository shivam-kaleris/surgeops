import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(mockData.getDashboardData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-depth p-3 md:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-4"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-ocean text-white px-6 py-4 rounded-xl shadow-depth"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.24C15.81 5.42 15.56 5.8 15.56 6.24C15.56 6.9 16.05 7.44 16.67 7.5L18.5 9.5L17 11L15 9L11 13L13 15L15 13L17 15L21 11V9ZM11 22H13V20H15V18H13V16H11V18H9V20H11V22Z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">SurgeOps</h1>
                  <p className="text-primary-foreground/80 text-sm">Port Authority Operations Center</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-success/20 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-success text-sm font-medium">OPERATIONAL</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-primary-foreground/80">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-lg font-mono">
                {new Date().toLocaleTimeString('en-US', { 
                  hour12: false,
                  timeZoneName: 'short'
                })}
              </div>
              <div className="text-sm text-primary-foreground/60">Singapore Port</div>
            </div>
          </div>
        </motion.div>

        {/* Row 1: KPIs - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <DashboardKPIs data={dashboardData.kpis} />
        </motion.div>

        {/* Professional Layout: Left Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left Sidebar: Collapsible Panels */}
          <div className="lg:col-span-3 space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <WeatherCard weather={dashboardData.weather} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AlertsPanel alerts={dashboardData.alerts} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <EventsPanel events={dashboardData.events} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <TestPanel onSimulate={(type, magnitude) => {
                console.log(`Simulating ${type} with magnitude ${magnitude}`);
                setDashboardData(mockData.getDashboardData());
              }} />
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-3">
            {/* Top Row: Chart + Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <UtilizationChart data={dashboardData.chartData} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <SurgeOpsChat />
              </motion.div>
            </div>

            {/* Yard Status - Centered with Consistent Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <YardGrid 
                blocks={dashboardData.yardBlocks}
                onBlockSelect={setSelectedYardBlock}
                selectedBlock={selectedYardBlock}
              />
            </motion.div>

            {/* Berth Status - Centered with Consistent Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <BerthStatus 
                berths={dashboardData.berths}
                onBerthSelect={setSelectedBerth}
                selectedBerth={selectedBerth}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}