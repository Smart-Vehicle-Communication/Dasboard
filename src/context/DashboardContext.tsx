
import React, { createContext, useContext, useState, useEffect } from 'react';
import mockDataService, { 
  Vehicle, 
  Accident, 
  MqttMessage, 
  SystemHealth 
} from '../services/mockData';

interface DashboardContextType {
  // Data
  vehicles: Vehicle[];
  accidents: Accident[];
  mqttMessages: MqttMessage[];
  systemHealth: SystemHealth;
  
  // Filters and controls
  selectedVehicleId: string | null;
  statusFilter: ('normal' | 'warning' | 'critical')[];
  alertsEnabled: boolean;
  
  // Actions
  setSelectedVehicleId: (id: string | null) => void;
  toggleStatusFilter: (status: 'normal' | 'warning' | 'critical') => void;
  toggleAlerts: () => void;
  
  // Helper functions
  getVehicleById: (id: string) => Vehicle | undefined;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [mqttMessages, setMqttMessages] = useState<MqttMessage[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    apiStatus: 'online',
    mqttStatus: 'connected',
    databaseStatus: 'healthy',
    lastCheck: new Date(),
  });
  
  // Filter and control states
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<('normal' | 'warning' | 'critical')[]>(['normal', 'warning', 'critical']);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  // Initialize data from service
  useEffect(() => {
    // Subscribe to data updates
    mockDataService.addListener('vehicles', setVehicles);
    mockDataService.addListener('accidents', setAccidents);
    mockDataService.addListener('mqttMessages', setMqttMessages);
    mockDataService.addListener('systemHealth', setSystemHealth);
    
    // Start the simulation
    mockDataService.startSimulation();
    
    // Cleanup on unmount
    return () => {
      mockDataService.removeListener('vehicles', setVehicles);
      mockDataService.removeListener('accidents', setAccidents);
      mockDataService.removeListener('mqttMessages', setMqttMessages);
      mockDataService.removeListener('systemHealth', setSystemHealth);
      mockDataService.stopSimulation();
    };
  }, []);
  
  // Toggle status filter
  const toggleStatusFilter = (status: 'normal' | 'warning' | 'critical') => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };
  
  // Toggle alerts
  const toggleAlerts = () => {
    setAlertsEnabled(prev => !prev);
  };
  
  // Get vehicle by ID
  const getVehicleById = (id: string) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };
  
  // Create context value
  const contextValue: DashboardContextType = {
    vehicles,
    accidents,
    mqttMessages,
    systemHealth,
    selectedVehicleId,
    statusFilter,
    alertsEnabled,
    setSelectedVehicleId,
    toggleStatusFilter,
    toggleAlerts,
    getVehicleById,
  };
  
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use the context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
