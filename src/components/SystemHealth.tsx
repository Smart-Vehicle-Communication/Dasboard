
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServerCrash, Database, Wifi, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SystemHealth: React.FC = () => {
  const { systemHealth } = useDashboard();
  
  const getStatusIcon = (status: 'online' | 'offline' | 'degraded' | 'connected' | 'disconnected' | 'connecting' | 'healthy') => {
    if (status === 'online' || status === 'connected' || status === 'healthy') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'offline' || status === 'disconnected') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  return (
    <Card className="h-full glassmorphism animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">System Health</CardTitle>
          <Badge variant="outline" className="bg-white/50">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>
              {systemHealth.lastCheck.toLocaleTimeString()}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* API Status */}
          <div className={`p-3 rounded-lg border ${
            systemHealth.apiStatus === 'online' 
              ? 'bg-green-50 border-green-100' 
              : systemHealth.apiStatus === 'offline' 
                ? 'bg-red-50 border-red-100' 
                : 'bg-yellow-50 border-yellow-100'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <ServerCrash className={`h-4 w-4 ${
                    systemHealth.apiStatus === 'online' 
                      ? 'text-green-500' 
                      : systemHealth.apiStatus === 'offline' 
                        ? 'text-red-500' 
                        : 'text-yellow-500'
                  }`} />
                  <span className="font-medium text-sm">API Server</span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(systemHealth.apiStatus)}
                  <span className="text-xs capitalize">
                    {systemHealth.apiStatus}
                  </span>
                </div>
              </div>
              <Badge className={`${
                systemHealth.apiStatus === 'online' 
                  ? 'bg-green-100 text-green-700' 
                  : systemHealth.apiStatus === 'offline' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
              }`}>
                {systemHealth.apiStatus === 'online' ? '100%' : systemHealth.apiStatus === 'offline' ? '0%' : '67%'}
              </Badge>
            </div>
          </div>
          
          {/* MQTT Status */}
          <div className={`p-3 rounded-lg border ${
            systemHealth.mqttStatus === 'connected' 
              ? 'bg-green-50 border-green-100' 
              : systemHealth.mqttStatus === 'disconnected' 
                ? 'bg-red-50 border-red-100' 
                : 'bg-yellow-50 border-yellow-100'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wifi className={`h-4 w-4 ${
                    systemHealth.mqttStatus === 'connected' 
                      ? 'text-green-500' 
                      : systemHealth.mqttStatus === 'disconnected' 
                        ? 'text-red-500' 
                        : 'text-yellow-500'
                  }`} />
                  <span className="font-medium text-sm">MQTT Broker</span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(systemHealth.mqttStatus)}
                  <span className="text-xs capitalize">
                    {systemHealth.mqttStatus}
                  </span>
                </div>
              </div>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                systemHealth.mqttStatus === 'connected' 
                  ? 'bg-green-100' 
                  : systemHealth.mqttStatus === 'disconnected' 
                    ? 'bg-red-100' 
                    : 'bg-yellow-100'
              }`}>
                <Activity className={`h-3.5 w-3.5 ${
                  systemHealth.mqttStatus === 'connected' 
                    ? 'text-green-700' 
                    : systemHealth.mqttStatus === 'disconnected' 
                      ? 'text-red-700' 
                      : 'text-yellow-700'
                }`} />
              </div>
            </div>
          </div>
          
          {/* Database Status */}
          <div className={`p-3 rounded-lg border ${
            systemHealth.databaseStatus === 'healthy' 
              ? 'bg-green-50 border-green-100' 
              : systemHealth.databaseStatus === 'offline' 
                ? 'bg-red-50 border-red-100' 
                : 'bg-yellow-50 border-yellow-100'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Database className={`h-4 w-4 ${
                    systemHealth.databaseStatus === 'healthy' 
                      ? 'text-green-500' 
                      : systemHealth.databaseStatus === 'offline' 
                        ? 'text-red-500' 
                        : 'text-yellow-500'
                  }`} />
                  <span className="font-medium text-sm">Database</span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(systemHealth.databaseStatus)}
                  <span className="text-xs capitalize">
                    {systemHealth.databaseStatus}
                  </span>
                </div>
              </div>
              <Badge className={`${
                systemHealth.databaseStatus === 'healthy' 
                  ? 'bg-green-100 text-green-700' 
                  : systemHealth.databaseStatus === 'offline' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
              }`}>
                {systemHealth.databaseStatus === 'healthy' ? 'Online' : systemHealth.databaseStatus === 'offline' ? 'Offline' : 'Degraded'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
