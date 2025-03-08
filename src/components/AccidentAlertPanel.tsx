
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, MapPin, Users } from 'lucide-react';

const AccidentAlertPanel: React.FC = () => {
  const { accidents, alertsEnabled } = useDashboard();
  
  // If alerts are disabled, show a message
  if (!alertsEnabled) {
    return (
      <Card className="h-full glassmorphism animate-fade-in">
        <CardHeader className="px-4 py-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Accidents & Alerts</CardTitle>
            <Badge variant="outline" className="bg-white/50">Alerts Disabled</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center h-[calc(100%-3.5rem)]">
          <div className="text-center text-gray-500">
            <AlertTriangle className="mx-auto mb-2 text-yellow-500" />
            <p>Alerts are currently disabled</p>
            <p className="text-sm">Enable alerts to see accident information</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full glassmorphism animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Accidents & Alerts</CardTitle>
          <Badge variant="outline" className="bg-white/50">
            {accidents.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {accidents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="text-green-500" size={24} />
            </div>
            <p>No active accidents</p>
            <p className="text-sm">All vehicles are operating normally</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accidents.map(accident => (
              <div 
                key={accident.id} 
                className={`p-3 rounded-lg border animate-pulse-slow ${
                  accident.severity === 'critical' 
                    ? 'bg-red-50 border-red-200' 
                    : accident.severity === 'major' 
                      ? 'bg-orange-50 border-orange-200' 
                      : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`${
                      accident.severity === 'critical' 
                        ? 'text-red-500' 
                        : accident.severity === 'major' 
                          ? 'text-orange-500' 
                          : 'text-yellow-500'
                    }`} size={16} />
                    <h3 className="font-medium">
                      {accident.severity.charAt(0).toUpperCase() + accident.severity.slice(1)} Accident
                    </h3>
                  </div>
                  <Badge variant="outline" className={`${
                    accident.severity === 'critical' 
                      ? 'text-red-500 border-red-200' 
                      : accident.severity === 'major' 
                        ? 'text-orange-500 border-orange-200' 
                        : 'text-yellow-500 border-yellow-200'
                  }`}>
                    {accident.id}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span>{accident.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users size={14} />
                    <span>{accident.involvedVehicles.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 col-span-2">
                    <MapPin size={14} />
                    <span>
                      {accident.location[0].toFixed(4)}, {accident.location[1].toFixed(4)}
                    </span>
                  </div>
                </div>
                
                {accident.nearbyFacilities && (
                  <div className="mt-2 p-2 bg-white/80 rounded border border-gray-100">
                    <h4 className="text-xs font-medium text-gray-600 mb-1">NEARBY FACILITIES</h4>
                    <ul className="text-xs space-y-1">
                      {accident.nearbyFacilities.hospital && (
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-medium">Hospital:</span>
                          <span>{accident.nearbyFacilities.hospital}</span>
                        </li>
                      )}
                      {accident.nearbyFacilities.policeStation && (
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-medium">Police:</span>
                          <span>{accident.nearbyFacilities.policeStation}</span>
                        </li>
                      )}
                      {accident.nearbyFacilities.fireBrigade && (
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-medium">Fire Brigade:</span>
                          <span>{accident.nearbyFacilities.fireBrigade}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccidentAlertPanel;
