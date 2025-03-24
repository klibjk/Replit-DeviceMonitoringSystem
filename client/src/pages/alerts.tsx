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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, MoreVertical, Pencil, Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { AlertType } from "@/lib/types";
import { Alert, Device } from "@shared/schema";

export default function Alerts() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  const { 
    data: alerts = [], 
    isLoading: isLoadingAlerts,
    isError: isErrorAlerts
  } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });
  
  const { 
    data: devices = [], 
    isLoading: isLoadingDevices 
  } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const getDeviceName = (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId);
    return device ? device.name : `Device #${deviceId}`;
  };
  
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = search === "" || 
      alert.message.toLowerCase().includes(search.toLowerCase()) ||
      getDeviceName(alert.device_id).toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "" || alert.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };
  
  const handleDeleteAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteAlert = async () => {
    if (!selectedAlert) return;
    
    try {
      await apiRequest('DELETE', `/api/alerts/${selectedAlert.id}`);
      
      toast({
        title: "Alert deleted",
        description: "Alert has been deleted successfully.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAlert(null);
    }
  };
  
  const getAlertBadgeVariant = (type: AlertType) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "secondary";
    }
  };
  
  if (isErrorAlerts) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading alerts
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Failed to fetch alert data. Please try again later.</p>
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
          <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
          <Button onClick={() => {
            setSelectedAlert(null);
            setIsAlertModalOpen(true);
          }}>
            Add Alert
          </Button>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All alert types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingAlerts || isLoadingDevices ? (
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[40px] ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="font-medium">
                            {getDeviceName(alert.device_id)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAlertBadgeVariant(alert.type as AlertType)}>
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate">
                            {alert.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          {alert.created_at 
                            ? formatDistanceToNow(new Date(alert.created_at), { addSuffix: true }) 
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
                              <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteAlert(alert)}
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
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        {search || typeFilter 
                          ? 'No alerts match your filters' 
                          : 'No alerts found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setSelectedAlert(null);
        }}
        alert={selectedAlert || undefined}
        isEdit={!!selectedAlert}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this alert.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAlert}
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
