import { 
  users, type User, type InsertUser,
  devices, type Device, type InsertDevice,
  alerts, type Alert, type InsertAlert,
  auditLogs, type AuditLog, type InsertAuditLog 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Device methods
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;
  
  // Alert methods
  getAlerts(): Promise<Alert[]>;
  getAlertsByDeviceId(deviceId: number): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;
  
  // Audit logs methods
  getAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private devices: Map<number, Device>;
  private alerts: Map<number, Alert>;
  private auditLogs: Map<number, AuditLog>;
  
  private userCurrentId: number;
  private deviceCurrentId: number;
  private alertCurrentId: number;
  private auditLogCurrentId: number;

  constructor() {
    this.users = new Map();
    this.devices = new Map();
    this.alerts = new Map();
    this.auditLogs = new Map();
    
    this.userCurrentId = 1;
    this.deviceCurrentId = 1;
    this.alertCurrentId = 1;
    this.auditLogCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Device methods
  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }
  
  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }
  
  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.deviceCurrentId++;
    const now = new Date();
    const device: Device = {
      ...insertDevice,
      id,
      created_at: now,
      updated_at: now
    };
    this.devices.set(id, device);
    return device;
  }
  
  async updateDevice(id: number, partialDevice: Partial<InsertDevice>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice: Device = {
      ...device,
      ...partialDevice,
      updated_at: new Date()
    };
    
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }
  
  async deleteDevice(id: number): Promise<boolean> {
    // Check if there are related alerts
    const relatedAlerts = await this.getAlertsByDeviceId(id);
    
    // If has related alerts, delete them first
    for (const alert of relatedAlerts) {
      await this.deleteAlert(alert.id);
    }
    
    return this.devices.delete(id);
  }
  
  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }
  
  async getAlertsByDeviceId(deviceId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.device_id === deviceId);
  }
  
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertCurrentId++;
    const now = new Date();
    const alert: Alert = {
      ...insertAlert,
      id,
      created_at: now
    };
    this.alerts.set(id, alert);
    return alert;
  }
  
  async updateAlert(id: number, partialAlert: Partial<InsertAlert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert: Alert = {
      ...alert,
      ...partialAlert
    };
    
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  async deleteAlert(id: number): Promise<boolean> {
    return this.alerts.delete(id);
  }
  
  // Audit logs methods
  async getAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values());
  }
  
  async createAuditLog(insertAuditLog: InsertAuditLog): Promise<AuditLog> {
    const id = this.auditLogCurrentId++;
    const now = new Date();
    const auditLog: AuditLog = {
      ...insertAuditLog,
      id,
      timestamp: now
    };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }
}

export const storage = new MemStorage();
