import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDeviceSchema, 
  insertAlertSchema, 
  insertAuditLogSchema, 
  type InsertDevice,
  type InsertAlert,
  type InsertAuditLog
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Middleware to handle validation errors
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            message: "Validation error",
            errors: error.errors
          });
        } else {
          next(error);
        }
      }
    };
  };
  
  // Helper function to log audit events
  const logAudit = async (
    tableName: string, 
    action: string, 
    recordId: number,
    performedBy: string = "system"
  ) => {
    const auditLog: InsertAuditLog = {
      table_name: tableName,
      action,
      record_id: recordId,
      performed_by: performedBy
    };
    
    return await storage.createAuditLog(auditLog);
  };
  
  // Device routes
  router.get("/devices", async (req, res) => {
    const devices = await storage.getDevices();
    res.json(devices);
  });
  
  router.get("/devices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }
    
    const device = await storage.getDevice(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    
    res.json(device);
  });
  
  router.post("/devices", validateRequest(insertDeviceSchema), async (req, res) => {
    try {
      const deviceData: InsertDevice = req.body;
      const device = await storage.createDevice(deviceData);
      
      // Log the create action
      await logAudit("devices", "create", device.id, req.body.performed_by || "system");
      
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to create device", error });
    }
  });
  
  router.put("/devices/:id", validateRequest(insertDeviceSchema), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }
    
    try {
      const deviceData: InsertDevice = req.body;
      const updatedDevice = await storage.updateDevice(id, deviceData);
      
      if (!updatedDevice) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      // Log the update action
      await logAudit("devices", "update", id, req.body.performed_by || "system");
      
      res.json(updatedDevice);
    } catch (error) {
      res.status(500).json({ message: "Failed to update device", error });
    }
  });
  
  router.delete("/devices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }
    
    try {
      const deleted = await storage.deleteDevice(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      // Log the delete action
      await logAudit("devices", "delete", id, req.query.performed_by?.toString() || "system");
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete device", error });
    }
  });
  
  // Alert routes
  router.get("/alerts", async (req, res) => {
    const deviceId = req.query.device_id;
    
    if (deviceId && !isNaN(Number(deviceId))) {
      const alerts = await storage.getAlertsByDeviceId(Number(deviceId));
      return res.json(alerts);
    }
    
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });
  
  router.get("/alerts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid alert ID" });
    }
    
    const alert = await storage.getAlert(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    
    res.json(alert);
  });
  
  router.post("/alerts", validateRequest(insertAlertSchema), async (req, res) => {
    try {
      const alertData: InsertAlert = req.body;
      
      // Check if the device exists
      const device = await storage.getDevice(alertData.device_id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      const alert = await storage.createAlert(alertData);
      
      // Log the create action
      await logAudit("alerts", "create", alert.id, req.body.performed_by || "system");
      
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create alert", error });
    }
  });
  
  router.put("/alerts/:id", validateRequest(insertAlertSchema), async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid alert ID" });
    }
    
    try {
      const alertData: InsertAlert = req.body;
      
      // Check if the alert exists
      const existingAlert = await storage.getAlert(id);
      if (!existingAlert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      // Check if the device exists if device_id is changing
      if (alertData.device_id !== existingAlert.device_id) {
        const device = await storage.getDevice(alertData.device_id);
        if (!device) {
          return res.status(404).json({ message: "Device not found" });
        }
      }
      
      const updatedAlert = await storage.updateAlert(id, alertData);
      
      // Log the update action
      await logAudit("alerts", "update", id, req.body.performed_by || "system");
      
      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert", error });
    }
  });
  
  router.delete("/alerts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid alert ID" });
    }
    
    try {
      const deleted = await storage.deleteAlert(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      // Log the delete action
      await logAudit("alerts", "delete", id, req.query.performed_by?.toString() || "system");
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete alert", error });
    }
  });
  
  // Audit logs routes
  router.get("/audit-logs", async (req, res) => {
    const auditLogs = await storage.getAuditLogs();
    res.json(auditLogs);
  });
  
  // Stats route for dashboard
  router.get("/stats", async (req, res) => {
    const devices = await storage.getDevices();
    const alerts = await storage.getAlerts();
    const auditLogs = await storage.getAuditLogs();
    
    // Calculate statistics
    const totalDevices = devices.length;
    const activeAlerts = alerts.length;
    const offlineDevices = devices.filter(device => device.status === 'offline').length;
    
    // Get only today's audit logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAuditLogs = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= today;
    });
    
    // Get recent alerts
    const recentAlerts = alerts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    res.json({
      totalDevices,
      activeAlerts,
      offlineDevices,
      todayAuditLogs: todayAuditLogs.length,
      recentAlerts
    });
  });
  
  // Register the router with the /api prefix
  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
}
