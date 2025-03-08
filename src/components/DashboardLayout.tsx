
import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import MapVisualization from './MapVisualization';
import VehicleStatusTable from './VehicleStatusTable';
import UserControls from './UserControls';

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-6 px-4">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">Autonomous Vehicle Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300">Live monitoring dashboard for connected autonomous vehicles</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <MapVisualization />
            </div>
            <div>
              <VehicleStatusTable />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <UserControls />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
