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
    <div className="min-h-screen bg-gradient-depth p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-ocean text-white p-6 rounded-xl shadow-depth"
        >
          <h1 className="text-3xl font-bold">SurgeOps Command Center</h1>
          <p className="text-primary-foreground/80 mt-2">
            AI-Powered Port Authority Surge Management
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Dashboard (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* KPIs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DashboardKPIs data={dashboardData.kpis} />
            </motion.div>

            {/* Utilization Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UtilizationChart data={dashboardData.chartData} />
            </motion.div>

            {/* Yard Status Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <YardGrid 
                blocks={dashboardData.yardBlocks}
                onBlockSelect={setSelectedYardBlock}
                selectedBlock={selectedYardBlock}
              />
            </motion.div>

            {/* Berth Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <BerthStatus 
                berths={dashboardData.berths}
                onBerthSelect={setSelectedBerth}
                selectedBerth={selectedBerth}
              />
            </motion.div>
          </div>

          {/* Right Column - Side Panels (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Weather Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeatherCard weather={dashboardData.weather} />
            </motion.div>

            {/* Alerts Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AlertsPanel alerts={dashboardData.alerts} />
            </motion.div>

            {/* Events Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <EventsPanel events={dashboardData.events} />
            </motion.div>

            {/* SurgeOps Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SurgeOpsChat />
            </motion.div>

            {/* Test Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <TestPanel onSimulate={(type, magnitude) => {
                console.log(`Simulating ${type} with magnitude ${magnitude}`);
                // Trigger dashboard updates
                setDashboardData(mockData.getDashboardData());
              }} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}