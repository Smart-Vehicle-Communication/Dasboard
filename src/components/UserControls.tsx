
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, BellRing, BellOff, MapPin } from 'lucide-react';

const UserControls: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicleId, 
    setSelectedVehicleId, 
    statusFilter, 
    toggleStatusFilter, 
    alertsEnabled, 
    toggleAlerts 
  } = useDashboard();
  
  return (
    <Card className="h-full glassmorphism animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Controls & Filters</CardTitle>
          <Badge variant="outline" className="bg-white/50">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <span>Filters</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Vehicle selection */}
        <div className="space-y-2">
          <Label htmlFor="vehicle-select" className="text-sm font-medium flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>Track Vehicle</span>
          </Label>
          <Select
            value={selectedVehicleId || ""}
            onValueChange={(value) => setSelectedVehicleId(value === "" ? null : value)}
          >
            <SelectTrigger id="vehicle-select" className="w-full bg-white/50">
              <SelectValue placeholder="All vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All vehicles</SelectItem>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.id} ({vehicle.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status Filter</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter.includes('normal') ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-3 ${
                statusFilter.includes('normal') 
                  ? 'bg-[#34C759] hover:bg-[#34C759]/90'
                  : 'border-[#34C759]/30 text-[#34C759]'
              }`}
              onClick={() => toggleStatusFilter('normal')}
            >
              Normal
            </Button>
            <Button
              variant={statusFilter.includes('warning') ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-3 ${
                statusFilter.includes('warning') 
                  ? 'bg-[#FF9500] hover:bg-[#FF9500]/90'
                  : 'border-[#FF9500]/30 text-[#FF9500]'
              }`}
              onClick={() => toggleStatusFilter('warning')}
            >
              Warning
            </Button>
            <Button
              variant={statusFilter.includes('critical') ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-3 ${
                statusFilter.includes('critical') 
                  ? 'bg-[#FF3B30] hover:bg-[#FF3B30]/90'
                  : 'border-[#FF3B30]/30 text-[#FF3B30]'
              }`}
              onClick={() => toggleStatusFilter('critical')}
            >
              Critical
            </Button>
          </div>
        </div>
        
        {/* Toggle alerts */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {alertsEnabled ? (
              <BellRing className="h-4 w-4 text-green-500" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <Label htmlFor="alerts-toggle" className="text-sm font-medium">
              Accident Alerts
            </Label>
          </div>
          <Switch
            id="alerts-toggle"
            checked={alertsEnabled}
            onCheckedChange={toggleAlerts}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserControls;
