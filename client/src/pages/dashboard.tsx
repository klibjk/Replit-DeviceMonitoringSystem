import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/stats-card";
import DeviceModal from "@/components/modals/device-modal";
import { HardDrive, AlertTriangle, WifiOff, ClipboardList } from "lucide-react";
import { AlertType, DashboardStats } from "@/lib/types";
import { Alert, Device } from "@shared/schema";

function getAlertBadgeVariant(type: AlertType) {
  switch (type) {
    case "critical":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function Dashboard() {
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useQuery<DashboardStats>({
    queryKey: ['/api/stats'],
  });
  
  // Fetch devices for the table
  const { 
    data: devices = [], 
    isLoading: isLoadingDevices 
  } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Devices"
              value={isLoadingStats ? <Skeleton className="h-7 w-12" /> : stats?.totalDevices || 0}
              icon={<HardDrive />}
              iconBgColor="bg-blue-500"
            />
            
            <StatsCard
              title="Active Alerts"
              value={isLoadingStats ? <Skeleton className="h-7 w-12" /> : stats?.activeAlerts || 0}
              icon={<AlertTriangle />}
              iconBgColor="bg-red-500"
            />
            
            <StatsCard
              title="Offline Devices"
              value={isLoadingStats ? <Skeleton className="h-7 w-12" /> : stats?.offlineDevices || 0}
              icon={<WifiOff />}
              iconBgColor="bg-gray-500"
            />
            
            <StatsCard
              title="Today's Audit Logs"
              value={isLoadingStats ? <Skeleton className="h-7 w-12" /> : stats?.todayAuditLogs || 0}
              icon={<ClipboardList />}
              iconBgColor="bg-green-500"
            />
          </div>
          
          {/* Recent Alerts */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Alerts</h3>
            <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
              {isLoadingStats ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <Skeleton className="h-9 w-16" />
                    </div>
                  ))}
                </div>
              ) : stats?.recentAlerts && stats.recentAlerts.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200">
                  {stats.recentAlerts.map((alert: Alert) => (
                    <li key={alert.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div>
                              <p className="text-sm font-medium text-primary truncate">
                                {/* Find device name by device_id */}
                                {devices.find(d => d.id === alert.device_id)?.name || `Device #${alert.device_id}`}
                              </p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate">{alert.message}</span>
                              </p>
                            </div>
                            <div className="hidden md:block">
                              <div>
                                <p className="text-sm text-gray-900">
                                  Created {alert.created_at 
                                    ? formatDistanceToNow(new Date(alert.created_at), { addSuffix: true }) 
                                    : 'recently'
                                  }
                                </p>
                                <Badge variant={getAlertBadgeVariant(alert.type as AlertType)}>
                                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="ml-5 flex-shrink-0">
                            <Link href="/alerts">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  No recent alerts
                </div>
              )}
            </div>
          </div>
          
          {/* Devices Status */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Devices Status</h3>
              <Button onClick={() => setIsDeviceModalOpen(true)}>
                Add Device
              </Button>
            </div>
            <div className="mt-2">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>OS</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingDevices ? (
                          [...Array(3)].map((_, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Skeleton className="h-10 w-10 rounded-full" />
                                  <Skeleton className="h-4 w-[100px]" />
                                </div>
                              </TableCell>
                              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                            </TableRow>
                          ))
                        ) : devices.length > 0 ? (
                          devices.slice(0, 5).map((device) => (
                            <TableRow key={device.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                                    <HardDrive className="h-6 w-6 text-gray-600" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {device.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: DEV-{device.id.toString().padStart(3, '0')}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{device.os}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    device.status === 'online' ? 'info' :
                                    device.status === 'offline' ? 'secondary' :
                                    device.status === 'warning' ? 'warning' : 'destructive'
                                  }
                                >
                                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{device.location}</TableCell>
                              <TableCell>
                                {device.updated_at 
                                  ? formatDistanceToNow(new Date(device.updated_at), { addSuffix: true }) 
                                  : '-'
                                }
                              </TableCell>
                              <TableCell className="text-right">
                                <Link href="/devices">
                                  <Button variant="link" size="sm" className="text-primary">View</Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                              No devices found. Add your first device.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Device Modal */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />
    </div>
  );
}
