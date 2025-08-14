// Mock data for SurgeOps dashboard simulation
export interface KPIData {
  avgYardUtilization: number;
  waitingVessels: number;
  activeAlerts: number;
  teuProcessed24h: number;
}

export interface ChartDataPoint {
  time: string;
  utilization: number;
  threshold: number;
}

export interface YardBlock {
  id: string;
  code: string;
  category: "Standard" | "Reefer" | "Hazard";
  capacity: number;
  current: number;
  utilization: number;
  status: "normal" | "warning" | "critical";
}

export interface Vessel {
  id: string;
  name: string;
  imo?: string;
  expectedTeu: number;
  eta: string;
  status: "Waiting" | "Berthing" | "Loading" | "Departed";
}

export interface BerthAssignment {
  id: string;
  berthCode: string;
  vessel: Vessel;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
}

export interface Berth {
  id: string;
  code: string;
  status: "Available" | "Occupied" | "Maintenance";
  assignments: BerthAssignment[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  icon: string;
  operationalImpact: "Low" | "Medium" | "High";
}

export interface Alert {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  suggestion?: {
    action: string;
    from: string;
    to: string;
    teu: number;
  };
}

export interface Event {
  id: string;
  type: "surge" | "weather" | "reroute" | "vessel" | "system";
  message: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
}

export interface DashboardData {
  kpis: KPIData;
  chartData: ChartDataPoint[];
  yardBlocks: YardBlock[];
  berths: Berth[];
  weather: WeatherData;
  alerts: Alert[];
  events: Event[];
}

class MockDataService {
  private static instance: MockDataService;
  private baseUtilization = 65;
  private surgeActive = false;
  private lastUpdate = Date.now();

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateChartData(): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseUtil = this.baseUtilization + Math.sin(i * 0.3) * 10;
      const noise = this.getRandomFloat(-5, 5);
      const utilization = Math.max(0, Math.min(100, baseUtil + noise));
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        utilization: Math.round(utilization * 10) / 10,
        threshold: 95
      });
    }
    
    return data;
  }

  private generateYardBlocks(): YardBlock[] {
    const blocks = [
      { code: "B1", category: "Standard" as const, capacity: 1200 },
      { code: "B2", category: "Standard" as const, capacity: 1000 },
      { code: "B3", category: "Reefer" as const, capacity: 800 },
      { code: "B4", category: "Hazard" as const, capacity: 600 },
      { code: "B5", category: "Standard" as const, capacity: 1400 }
    ];

    return blocks.map(block => {
      const baseUtil = this.getRandomFloat(60, 90);
      const current = Math.round(block.capacity * (baseUtil / 100));
      const utilization = (current / block.capacity) * 100;
      
      let status: "normal" | "warning" | "critical" = "normal";
      if (utilization >= 95) status = "critical";
      else if (utilization >= 80) status = "warning";

      return {
        id: block.code,
        code: block.code,
        category: block.category,
        capacity: block.capacity,
        current,
        utilization: Math.round(utilization * 10) / 10,
        status
      };
    });
  }

  private generateVessels(): Vessel[] {
    const vesselNames = [
      "MV Ocean Grace", "MSC Determination", "COSCO Fortune", 
      "Evergreen Harmony", "APL Singapore", "CMA CGM Explorer"
    ];
    
    const statuses: Vessel["status"][] = ["Waiting", "Berthing", "Loading", "Departed"];
    
    return vesselNames.map((name, index) => ({
      id: `vessel-${index + 1}`,
      name,
      imo: `IMO${7000000 + index}`,
      expectedTeu: this.getRandomInt(800, 2400),
      eta: new Date(Date.now() + this.getRandomInt(2, 72) * 60 * 60 * 1000).toISOString(),
      status: statuses[this.getRandomInt(0, statuses.length - 1)]
    }));
  }

  private generateBerths(): Berth[] {
    const vessels = this.generateVessels();
    const berths = ["BERTH-1", "BERTH-2", "BERTH-3"];
    
    return berths.map((code, index) => {
      const berthVessels = vessels.slice(index * 2, (index * 2) + 2);
      const assignments: BerthAssignment[] = berthVessels.map((vessel, vIndex) => ({
        id: `assignment-${index}-${vIndex}`,
        berthCode: code,
        vessel,
        plannedStart: new Date(Date.now() + vIndex * 24 * 60 * 60 * 1000).toISOString(),
        plannedEnd: new Date(Date.now() + (vIndex + 1) * 24 * 60 * 60 * 1000).toISOString(),
        actualStart: vIndex === 0 ? new Date().toISOString() : undefined
      }));

      return {
        id: code,
        code,
        status: assignments.some(a => a.actualStart && !a.actualEnd) ? "Occupied" as const : "Available" as const,
        assignments
      };
    });
  }

  private generateAlerts(): Alert[] {
    const alerts: Alert[] = [];
    
    // Generate critical alerts for blocks over 95%
    const criticalBlocks = this.generateYardBlocks().filter(b => b.utilization >= 95);
    criticalBlocks.forEach(block => {
      alerts.push({
        id: `alert-${block.code}`,
        severity: "CRITICAL",
        message: `Yard block ${block.code} at ${block.utilization}% capacity`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        suggestion: {
          action: "Move containers",
          from: block.code,
          to: "B5", // Assume B5 has lowest utilization
          teu: Math.round((block.utilization - 80) * block.capacity / 100)
        }
      });
    });

    // Add weather alerts if conditions are severe
    if (this.getRandomFloat(0, 1) > 0.7) {
      alerts.push({
        id: "alert-weather",
        severity: "HIGH",
        message: "High wind conditions affecting crane operations",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        acknowledged: false
      });
    }

    return alerts;
  }

  private generateEvents(): Event[] {
    const events: Event[] = [];
    const eventTypes = [
      { type: "vessel" as const, message: "MV Ocean Grace updated ETA", severity: "info" as const },
      { type: "surge" as const, message: "Surge prediction model updated", severity: "warning" as const },
      { type: "weather" as const, message: "Weather conditions improving", severity: "info" as const },
      { type: "reroute" as const, message: "Red Sea advisory - expect rerouted vessels", severity: "warning" as const },
      { type: "system" as const, message: "Yard utilization snapshot completed", severity: "info" as const }
    ];

    // Generate recent events
    for (let i = 0; i < 5; i++) {
      const event = eventTypes[this.getRandomInt(0, eventTypes.length - 1)];
      events.push({
        id: `event-${i}`,
        type: event.type,
        message: event.message,
        timestamp: new Date(Date.now() - i * 15 * 60 * 1000).toISOString(),
        severity: event.severity
      });
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getDashboardData(): DashboardData {
    const yardBlocks = this.generateYardBlocks();
    const vessels = this.generateVessels();
    const waitingVessels = vessels.filter(v => v.status === "Waiting" || v.status === "Berthing");
    const alerts = this.generateAlerts();

    return {
      kpis: {
        avgYardUtilization: Math.round(yardBlocks.reduce((sum, block) => sum + block.utilization, 0) / yardBlocks.length * 10) / 10,
        waitingVessels: waitingVessels.length,
        activeAlerts: alerts.filter(a => !a.acknowledged).length,
        teuProcessed24h: this.getRandomInt(8500, 12000)
      },
      chartData: this.generateChartData(),
      yardBlocks,
      berths: this.generateBerths(),
      weather: {
        location: "Singapore Port",
        temperature: this.getRandomFloat(26, 32),
        windSpeed: this.getRandomFloat(5, 25),
        humidity: this.getRandomFloat(65, 85),
        condition: this.getRandomFloat(0, 1) > 0.8 ? "Stormy" : this.getRandomFloat(0, 1) > 0.6 ? "Cloudy" : "Clear",
        icon: "🌤️",
        operationalImpact: this.getRandomFloat(0, 1) > 0.8 ? "High" : this.getRandomFloat(0, 1) > 0.5 ? "Medium" : "Low"
      },
      alerts,
      events: this.generateEvents()
    };
  }

  triggerSurge(magnitude: number = 0.3) {
    this.baseUtilization = Math.min(95, this.baseUtilization + magnitude * 30);
    this.surgeActive = true;
    setTimeout(() => {
      this.surgeActive = false;
    }, 15000); // 15 second surge simulation
  }

  resetData() {
    this.baseUtilization = 65;
    this.surgeActive = false;
  }
}

export const mockData = MockDataService.getInstance();