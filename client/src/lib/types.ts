import { Alert } from "@shared/schema";

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error';
export type AlertType = 'info' | 'warning' | 'critical';

export interface DashboardStats {
  totalDevices: number;
  activeAlerts: number;
  offlineDevices: number;
  todayAuditLogs: number;
  recentAlerts: Alert[];
}
