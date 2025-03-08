
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User } from 'lucide-react';

const MqttFeed: React.FC = () => {
  const { mqttMessages } = useDashboard();
  
  return (
    <Card className="h-full glassmorphism animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">MQTT Data Feed</CardTitle>
          <Badge variant="outline" className="bg-white/50">
            {mqttMessages.length} Messages
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4 px-4">
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
            {mqttMessages.map((message, index) => (
              <div 
                key={message.id} 
                className={`p-2 rounded-lg border text-sm ${
                  message.topic.includes('alert') 
                    ? 'bg-red-50 border-red-100'
                    : index === 0 
                      ? 'bg-blue-50 border-blue-100 animate-pulse-slow' 
                      : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={14} className={message.topic.includes('alert') ? 'text-red-500' : 'text-blue-500'} />
                    <span className="font-medium">{message.topic}</span>
                  </div>
                  <Badge variant="outline" className="text-xs px-1 h-5">{index === 0 ? 'New' : `#${mqttMessages.length - index}`}</Badge>
                </div>
                
                <div className="flex flex-wrap text-xs text-gray-600 gap-x-4 gap-y-1 mb-1.5">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>{message.senderId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 text-white p-2 rounded text-xs font-mono overflow-x-auto">
                  {message.payload}
                </div>
              </div>
            ))}
            
            {mqttMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="mx-auto mb-2" />
                <p>No messages received</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MqttFeed;
