import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keep the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Device schema
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  os: text("os").notNull(),
  status: text("status").notNull(), // 'online', 'offline', 'warning', 'error'
  location: text("location").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

// Alert schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  device_id: integer("device_id").notNull(),
  type: text("type").notNull(), // 'info', 'warning', 'critical'
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  created_at: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// Audit Logs schema
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  table_name: text("table_name").notNull(),
  action: text("action").notNull(), // 'create', 'update', 'delete'
  record_id: integer("record_id").notNull(),
  performed_by: text("performed_by").notNull().default("system"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
