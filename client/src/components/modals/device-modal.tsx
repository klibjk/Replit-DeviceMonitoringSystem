import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DeviceStatus } from "@/lib/types";
import { Device } from "@shared/schema";

// Extended schema with validation
const deviceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  os: z.string().min(1, "Operating system is required"),
  status: z.enum(["online", "offline", "warning", "error"]),
  location: z.string().min(1, "Location is required"),
});

type DeviceFormValues = z.infer<typeof deviceFormSchema>;

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device?: Device;
  isEdit?: boolean;
}

export default function DeviceModal({ 
  isOpen, 
  onClose, 
  device, 
  isEdit = false 
}: DeviceModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      name: device?.name || "",
      os: device?.os || "",
      status: (device?.status as DeviceStatus) || "online",
      location: device?.location || "",
    }
  });
  
  // Reset form when device changes
  useEffect(() => {
    if (device) {
      form.reset({
        name: device.name,
        os: device.os,
        status: device.status as DeviceStatus,
        location: device.location,
      });
    } else {
      form.reset({
        name: "",
        os: "",
        status: "online",
        location: "",
      });
    }
  }, [device, form]);
  
  const onSubmit = async (data: DeviceFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && device) {
        await apiRequest('PUT', `/api/devices/${device.id}`, data);
        toast({
          title: "Device updated",
          description: "Device has been updated successfully.",
        });
      } else {
        await apiRequest('POST', '/api/devices', data);
        toast({
          title: "Device created",
          description: "New device has been created successfully.",
        });
      }
      // Invalidate the devices cache
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      onClose();
    } catch (error) {
      console.error("Error saving device:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} device. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Device' : 'Add New Device'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Device name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="os"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating System</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select OS" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Windows 10">Windows 10</SelectItem>
                      <SelectItem value="Windows 11">Windows 11</SelectItem>
                      <SelectItem value="macOS">macOS</SelectItem>
                      <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                      <SelectItem value="CentOS">CentOS</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Device location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Device' : 'Add Device'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
