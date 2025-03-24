import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { HardDrive, MoreVertical, AlertTriangle, Pencil, Trash } from "lucide-react";
import DeviceModal from "@/components/modals/device-modal";
import AlertModal from "@/components/modals/alert-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Device } from "@shared/schema";

export default function Devices() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  
  const { 
    data: devices = [], 
    isLoading,
    isError
  } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(search.toLowerCase()) ||
    device.os.toLowerCase().includes(search.toLowerCase()) ||
    device.location.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsDeviceModalOpen(true);
  };
  
  const handleAddAlert = (device: Device) => {
    setSelectedDevice(device);
    setIsAlertModalOpen(true);
  };
  
  const handleDeleteDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteDevice = async () => {
    if (!selectedDevice) return;
    
    try {
      await apiRequest('DELETE', `/api/devices/${selectedDevice.id}`);
      
      toast({
        title: "Device deleted",
        description: "Device has been deleted successfully.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    } catch (error) {
      console.error("Error deleting device:", error);
      toast({
        title: "Error",
        description: "Failed to delete device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedDevice(null);
    }
  };
  
  if (isError) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading devices
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Failed to fetch device data. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
          <Button onClick={() => {
            setSelectedDevice(null);
            setIsDeviceModalOpen(true);
          }}>
            Add Device
          </Button>
        </div>
        
        <div className="mt-4">
          <Input
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, index) => (
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
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[40px] ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
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
                          {device.created_at 
                            ? format(new Date(device.created_at), 'MMM d, yyyy')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {device.updated_at 
                            ? formatDistanceToNow(new Date(device.updated_at), { addSuffix: true }) 
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditDevice(device)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddAlert(device)}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Add Alert
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteDevice(device)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        {search ? 'No devices match your search' : 'No devices found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Device Modal */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => {
          setIsDeviceModalOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice || undefined}
        isEdit={!!selectedDevice}
      />
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setSelectedDevice(null);
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the device
              {selectedDevice ? ` "${selectedDevice.name}"` : ''} and all associated alerts.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDevice}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
