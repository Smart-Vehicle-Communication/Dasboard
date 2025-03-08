
// Vehicle data model
export interface Vehicle {
  id: string;
  location: [number, number]; // [latitude, longitude]
  speed: number;
  status: 'normal' | 'warning' | 'critical';
  batteryLevel: number;
  lastUpdate: Date;
}

// Accident data model
export interface Accident {
  id: string;
  location: [number, number];
  timestamp: Date;
  severity: 'minor' | 'major' | 'critical';
  involvedVehicles: string[];
  nearbyFacilities?: {
    hospital?: string;
    policeStation?: string;
    fireBrigade?: string;
  };
}

// MQTT message model
export interface MqttMessage {
  id: string;
  topic: string;
  payload: string;
  timestamp: Date;
  senderId: string;
}

// System health model
export interface SystemHealth {
  apiStatus: 'online' | 'offline' | 'degraded';
  mqttStatus: 'connected' | 'disconnected' | 'connecting';
  databaseStatus: 'healthy' | 'degraded' | 'offline';
  lastCheck: Date;
}

// Initial mock data
const initialVehicles: Vehicle[] = [
  {
    id: 'AV-001',
    location: [37.7749, -122.4194], // San Francisco
    speed: 45,
    status: 'normal',
    batteryLevel: 78,
    lastUpdate: new Date(),
  },
  {
    id: 'AV-002',
    location: [37.7833, -122.4167], // San Francisco area
    speed: 38,
    status: 'warning',
    batteryLevel: 45,
    lastUpdate: new Date(),
  },
  {
    id: 'AV-003',
    location: [37.7694, -122.4862], // San Francisco area
    speed: 0,
    status: 'critical',
    batteryLevel: 12,
    lastUpdate: new Date(),
  },
  {
    id: 'AV-004',
    location: [37.7815, -122.4060], // San Francisco area
    speed: 62,
    status: 'normal',
    batteryLevel: 90,
    lastUpdate: new Date(),
  },
  {
    id: 'AV-005',
    location: [37.7900, -122.4200], // San Francisco area
    speed: 27,
    status: 'normal',
    batteryLevel: 65,
    lastUpdate: new Date(),
  },
];

const initialAccidents: Accident[] = [
  {
    id: 'ACC-001',
    location: [37.7694, -122.4862], // Same as AV-003
    timestamp: new Date(),
    severity: 'critical',
    involvedVehicles: ['AV-003'],
    nearbyFacilities: {
      hospital: 'SF General Hospital (2.3 miles)',
      policeStation: 'SFPD Mission Station (1.1 miles)',
      fireBrigade: 'SF Fire Station 7 (0.8 miles)',
    },
  },
];

const initialMqttMessages: MqttMessage[] = [
  {
    id: 'MSG-001',
    topic: 'vehicles/status',
    payload: '{"id":"AV-001","status":"normal","batteryLevel":78}',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    senderId: 'AV-001',
  },
  {
    id: 'MSG-002',
    topic: 'vehicles/status',
    payload: '{"id":"AV-002","status":"warning","batteryLevel":45}',
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    senderId: 'AV-002',
  },
  {
    id: 'MSG-003',
    topic: 'vehicles/alert',
    payload: '{"id":"AV-003","status":"critical","batteryLevel":12,"issue":"collision_detected"}',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    senderId: 'AV-003',
  },
];

const initialSystemHealth: SystemHealth = {
  apiStatus: 'online',
  mqttStatus: 'connected',
  databaseStatus: 'healthy',
  lastCheck: new Date(),
};

// Helper to get random movement
const getRandomMovement = () => {
  return (Math.random() - 0.5) * 0.001; // Small random movement
};

// Helper to generate a new MQTT message
const generateMqttMessage = (vehicle: Vehicle): MqttMessage => {
  const topics = ['vehicles/status', 'vehicles/location', 'vehicles/alert'];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const payload = JSON.stringify({
    id: vehicle.id,
    status: vehicle.status,
    batteryLevel: vehicle.batteryLevel,
    location: vehicle.location
  });
  
  return {
    id: `MSG-${Date.now()}`,
    topic: randomTopic,
    payload,
    timestamp: new Date(),
    senderId: vehicle.id,
  };
};

// Mock data service
export class MockDataService {
  private vehicles: Vehicle[] = [...initialVehicles];
  private accidents: Accident[] = [...initialAccidents];
  private mqttMessages: MqttMessage[] = [...initialMqttMessages];
  private systemHealth: SystemHealth = { ...initialSystemHealth };
  private simulationInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: { [key: string]: Function[] } = {
    vehicles: [],
    accidents: [],
    mqttMessages: [],
    systemHealth: [],
  };

  constructor() {
    // Initialize with mock data
  }

  // Start simulation
  startSimulation(intervalMs = 2000) {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    
    this.simulationInterval = setInterval(() => {
      this.updateVehicles();
      this.updateMqttMessages();
      this.updateSystemHealth();
      
      // Notify listeners
      this.notifyListeners('vehicles', this.vehicles);
      this.notifyListeners('mqttMessages', this.mqttMessages);
      this.notifyListeners('systemHealth', this.systemHealth);
    }, intervalMs);
  }

  // Stop simulation
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  // Update vehicles with random movement
  private updateVehicles() {
    this.vehicles = this.vehicles.map(vehicle => {
      // Generate new location with small random movement
      const newLocation: [number, number] = [
        vehicle.location[0] + getRandomMovement(),
        vehicle.location[1] + getRandomMovement(),
      ];
      
      // Random speed fluctuation
      const newSpeed = Math.max(0, vehicle.speed + (Math.random() - 0.5) * 5);
      
      // Random battery drain
      const newBatteryLevel = Math.max(0, vehicle.batteryLevel - Math.random() * 0.5);
      
      // Determine status based on battery level or random events
      let newStatus = vehicle.status;
      if (newBatteryLevel < 15) {
        newStatus = 'critical';
      } else if (newBatteryLevel < 30) {
        newStatus = 'warning';
      } else if (Math.random() < 0.05) { // 5% chance to change status
        const statuses: ('normal' | 'warning' | 'critical')[] = ['normal', 'warning', 'critical'];
        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      return {
        ...vehicle,
        location: newLocation,
        speed: newSpeed,
        batteryLevel: newBatteryLevel,
        status: newStatus,
        lastUpdate: new Date(),
      };
    });
  }

  // Generate new MQTT messages
  private updateMqttMessages() {
    // Generate a message for a random vehicle
    const randomVehicle = this.vehicles[Math.floor(Math.random() * this.vehicles.length)];
    const newMessage = generateMqttMessage(randomVehicle);
    
    // Add to messages list
    this.mqttMessages = [newMessage, ...this.mqttMessages.slice(0, 19)]; // Keep last 20 messages
  }

  // Update system health
  private updateSystemHealth() {
    // Small chance of status changes
    if (Math.random() < 0.02) { // 2% chance
      const apiStatuses: ('online' | 'offline' | 'degraded')[] = ['online', 'offline', 'degraded'];
      const mqttStatuses: ('connected' | 'disconnected' | 'connecting')[] = ['connected', 'disconnected', 'connecting'];
      const dbStatuses: ('healthy' | 'degraded' | 'offline')[] = ['healthy', 'degraded', 'offline'];
      
      this.systemHealth = {
        apiStatus: apiStatuses[Math.floor(Math.random() * apiStatuses.length)],
        mqttStatus: mqttStatuses[Math.floor(Math.random() * mqttStatuses.length)],
        databaseStatus: dbStatuses[Math.floor(Math.random() * dbStatuses.length)],
        lastCheck: new Date(),
      };
    } else {
      this.systemHealth = {
        ...this.systemHealth,
        lastCheck: new Date(),
      };
    }
  }

  // Add listener for data updates
  addListener(dataType: 'vehicles' | 'accidents' | 'mqttMessages' | 'systemHealth', callback: Function) {
    if (!this.listeners[dataType]) {
      this.listeners[dataType] = [];
    }
    this.listeners[dataType].push(callback);
    
    // Immediately send current data
    switch (dataType) {
      case 'vehicles':
        callback(this.vehicles);
        break;
      case 'accidents':
        callback(this.accidents);
        break;
      case 'mqttMessages':
        callback(this.mqttMessages);
        break;
      case 'systemHealth':
        callback(this.systemHealth);
        break;
    }
  }

  // Remove listener
  removeListener(dataType: 'vehicles' | 'accidents' | 'mqttMessages' | 'systemHealth', callback: Function) {
    if (this.listeners[dataType]) {
      this.listeners[dataType] = this.listeners[dataType].filter(cb => cb !== callback);
    }
  }

  // Notify all listeners of a specific type
  private notifyListeners(dataType: string, data: any) {
    if (this.listeners[dataType]) {
      this.listeners[dataType].forEach(callback => callback(data));
    }
  }

  // Get current data
  getVehicles() {
    return [...this.vehicles];
  }

  getAccidents() {
    return [...this.accidents];
  }

  getMqttMessages() {
    return [...this.mqttMessages];
  }

  getSystemHealth() {
    return { ...this.systemHealth };
  }
}

// Singleton instance
const mockDataService = new MockDataService();
export default mockDataService;
