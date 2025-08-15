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
import { SurgeActionPlan } from "./SurgeActionPlan";
import { mockData } from "../../lib/mockData";

export function SurgeOpsDashboard() {
  const [dashboardData, setDashboardData] = useState(mockData.getDashboardData());
  const [selectedYardBlock, setSelectedYardBlock] = useState<string | null>(null);
  const [selectedBerth, setSelectedBerth] = useState<string | null>(null);
  const [events, setEvents] = useState(dashboardData.events);
  const [currentPort, setCurrentPort] = useState("Singapore Port");
  const [currentTimeZone, setCurrentTimeZone] = useState("Asia/Singapore");
  const [showSurgeActionPlan, setShowSurgeActionPlan] = useState(false);
  const [surgeDetected, setSurgeDetected] = useState(false);

  // Simulate real-time updates and surge detection
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = mockData.getDashboardData();
      setDashboardData(newData);
      setEvents(newData.events);
      
      // Check for surge conditions (e.g., high waiting vessels or critical alerts)
      const waitingVessels = newData.kpis.waitingVessels || 0;
      const criticalAlerts = newData.alerts.filter(alert => alert.severity === "CRITICAL").length;
      
      if ((parseInt(waitingVessels.toString()) > 8 || criticalAlerts > 2) && !surgeDetected) {
        setSurgeDetected(true);
        setShowSurgeActionPlan(true);
      } else if (parseInt(waitingVessels.toString()) <= 5 && criticalAlerts <= 1) {
        setSurgeDetected(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [surgeDetected]);

  const handleClearEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleClearAllEvents = () => {
    setEvents([]);
  };

  const handleLocationChange = (location: string, timeZone: string) => {
    setCurrentPort(location);
    setCurrentTimeZone(timeZone);
  };

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
            </div>
            
            {/* Centered OPERATIONAL Status */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 px-4 py-2 bg-success/20 rounded-full border border-success/30">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-white text-base font-bold tracking-wide">OPERATIONAL</span>
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
                  timeZone: currentTimeZone,
                  timeZoneName: 'short'
                })}
              </div>
              <div className="text-sm text-primary-foreground/60">{currentPort}</div>
            </div>
          </div>
        </motion.div>

        {/* Row 1: KPIs and Surge Alert - Full Width */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <DashboardKPIs data={dashboardData.kpis} />
          </motion.div>

          {/* Surge Alert Banner */}
          {surgeDetected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full pr-80"
            >
              <div className="bg-gradient-to-r from-warning/10 to-destructive/10 border border-warning/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Surge Condition Detected</h3>
                      <p className="text-sm text-muted-foreground">High vessel congestion requiring immediate action plan</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSurgeActionPlan(true)}
                    className="px-6 py-2 bg-warning text-warning-foreground rounded-lg font-semibold hover:bg-warning/90 transition-colors"
                  >
                    Generate Action Plan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Professional Dashboard Layout */}
        <div className="relative space-y-4">
          {/* Main Content - Chart and AI Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pr-80"> {/* Add right padding for sidebar */}
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

          {/* Operations Section - Independent Layout */}
          <div className="space-y-4 pr-80"> {/* Add right padding for sidebar */}
            {/* Yard Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
              transition={{ delay: 0.7 }}
            >
              <BerthStatus 
                berths={dashboardData.berths}
                onBerthSelect={setSelectedBerth}
                selectedBerth={selectedBerth}
              />
            </motion.div>
          </div>

          {/* Right Sidebar - Absolutely Positioned */}
          <div className="absolute top-0 right-0 w-72 space-y-3 z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AlertsPanel alerts={dashboardData.alerts} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <EventsPanel 
                events={events} 
                onClearEvent={handleClearEvent}
                onClearAll={handleClearAllEvents}
              />
            </motion.div>
            
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <WeatherCard 
                  weather={dashboardData.weather} 
                  onLocationChange={handleLocationChange}
                />
              </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <TestPanel onSimulate={(type, magnitude) => {
                console.log(`Simulating ${type} with magnitude ${magnitude}`);
                setDashboardData(mockData.getDashboardData());
              }} />
            </motion.div>
          </div>
        </div>

        {/* Surge Action Plan Modal */}
        <SurgeActionPlan
          dashboardData={dashboardData}
          isVisible={showSurgeActionPlan}
          onClose={() => setShowSurgeActionPlan(false)}
        />
      </motion.div>
    </div>
  );
}