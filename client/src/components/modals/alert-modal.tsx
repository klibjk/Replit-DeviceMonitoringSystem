import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertType } from "@/lib/types";
import { Alert, Device } from "@shared/schema";

// Extended schema with validation
const alertFormSchema = z.object({
  device_id: z.union([
    z.string().min(1, "Device is required").transform(val => parseInt(val, 10)),
    z.number().int().positive("Device ID must be a positive integer")
  ]),
  type: z.enum(["info", "warning", "critical"]),
  message: z.string().min(3, "Message must be at least 3 characters"),
});

// Using a custom type to work with string device_id in the form
interface AlertFormValues {
  device_id: string | number;
  type: AlertType;
  message: string;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert?: Alert;
  isEdit?: boolean;
}

export default function AlertModal({ 
  isOpen, 
  onClose, 
  alert, 
  isEdit = false 
}: AlertModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch devices for dropdown
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      device_id: alert?.device_id ? String(alert.device_id) : "",
      type: alert?.type as AlertType || "info",
      message: alert?.message || "",
    }
  });
  
  // Reset form when alert changes
  useEffect(() => {
    if (alert) {
      form.reset({
        device_id: String(alert.device_id), // Convert to string for the form
        type: alert.type as AlertType,
        message: alert.message,
      });
    } else {
      form.reset({
        device_id: "", // Will be transformed to number by schema
        type: "info",
        message: "",
      });
    }
  }, [alert, form]);
  
  const onSubmit = async (data: AlertFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert device_id to number if it's a string
      const formattedData = {
        ...data,
        device_id: typeof data.device_id === 'string' 
          ? parseInt(data.device_id, 10) 
          : data.device_id
      };
      
      if (isEdit && alert) {
        await apiRequest('PUT', `/api/alerts/${alert.id}`, formattedData);
        toast({
          title: "Alert updated",
          description: "Alert has been updated successfully.",
        });
      } else {
        await apiRequest('POST', '/api/alerts', formattedData);
        toast({
          title: "Alert created",
          description: "New alert has been created successfully.",
        });
      }
      // Invalidate the alerts cache
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      onClose();
    } catch (error) {
      console.error("Error saving alert:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} alert. Please try again.`,
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
          <DialogTitle>{isEdit ? 'Edit Alert' : 'Add New Alert'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="device_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value ? field.value.toString() : undefined}
                    disabled={isLoadingDevices}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Device" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.id} value={device.id.toString()}>
                          {device.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "info"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Alert message" 
                      rows={3} 
                      {...field} 
                    />
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
                variant={isEdit ? "default" : "destructive"}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Alert' : 'Add Alert'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
