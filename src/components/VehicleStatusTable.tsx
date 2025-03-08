
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Battery, Gauge, MapPin } from 'lucide-react';

const VehicleStatusTable: React.FC = () => {
  const { vehicles, selectedVehicleId, setSelectedVehicleId, statusFilter } = useDashboard();
  
  // Filter vehicles based on status filter
  const filteredVehicles = vehicles
    .filter(v => statusFilter.includes(v.status))
    .sort((a, b) => {
      // Sort by status (critical first, then warning, then normal)
      const statusOrder = { critical: 0, warning: 1, normal: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  
  const getStatusBadge = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal':
        return <Badge className="status-normal">Normal</Badge>;
      case 'warning':
        return <Badge className="status-warning">Warning</Badge>;
      case 'critical':
        return <Badge className="status-critical">Critical</Badge>;
    }
  };
  
  return (
    <Card className="h-full glassmorphism animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Vehicle Status</CardTitle>
          <Badge variant="outline" className="bg-white/50">
            {filteredVehicles.length} Vehicles
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4 px-4">
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-white/50 sticky top-0">
                <TableRow>
                  <TableHead className="w-[100px] font-medium">ID</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>Location</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1">
                      <Gauge size={14} />
                      <span>Speed</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1">
                      <Battery size={14} />
                      <span>Battery</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map(vehicle => (
                  <TableRow 
                    key={vehicle.id}
                    className={`transition-all ${selectedVehicleId === vehicle.id ? 'bg-blue-50' : ''} cursor-pointer hover:bg-blue-50/50`}
                    onClick={() => setSelectedVehicleId(vehicle.id === selectedVehicleId ? null : vehicle.id)}
                  >
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      {vehicle.location[0].toFixed(4)}, {vehicle.location[1].toFixed(4)}
                    </TableCell>
                    <TableCell>
                      {Math.round(vehicle.speed)} mph
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              vehicle.batteryLevel > 30 
                                ? 'bg-green-500' 
                                : vehicle.batteryLevel > 15 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(0, Math.round(vehicle.batteryLevel))}%` }}
                          />
                        </div>
                        <span className="text-xs">{Math.round(vehicle.batteryLevel)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No vehicles matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleStatusTable;
