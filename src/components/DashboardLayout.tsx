
import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import MapVisualization from './MapVisualization';
import VehicleStatusTable from './VehicleStatusTable';
import AccidentAlertPanel from './AccidentAlertPanel';
import MqttFeed from './MqttFeed';
import UserControls from './UserControls';
import SystemHealth from './SystemHealth';
import { AlertCircle } from 'lucide-react';

// Error fallback component for individual sections
const SectionErrorFallback = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <h3 className="text-lg font-medium text-red-700 dark:text-red-300">Component Error</h3>
      <p className="text-sm text-center text-red-600 dark:text-red-400">
        There was an error loading the {name} component. Please try refreshing the page.
      </p>
    </div>
  );
};

// Custom error boundary class
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.name}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <SectionErrorFallback name={this.props.name} />;
    }

    return this.props.children;
  }
}

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-6 px-4">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">Autonomous Vehicle Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300">Live monitoring dashboard for connected autonomous vehicles</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <ComponentErrorBoundary name="Map Visualization">
                <MapVisualization />
              </ComponentErrorBoundary>
            </div>
            <div>
              <ComponentErrorBoundary name="Vehicle Status Table">
                <VehicleStatusTable />
              </ComponentErrorBoundary>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ComponentErrorBoundary name="Accident Alert Panel">
              <AccidentAlertPanel />
            </ComponentErrorBoundary>
            <ComponentErrorBoundary name="MQTT Feed">
              <MqttFeed />
            </ComponentErrorBoundary>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentErrorBoundary name="User Controls">
              <UserControls />
            </ComponentErrorBoundary>
            <ComponentErrorBoundary name="System Health">
              <SystemHealth />
            </ComponentErrorBoundary>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
