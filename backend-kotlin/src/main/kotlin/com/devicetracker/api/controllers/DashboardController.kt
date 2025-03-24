package com.devicetracker.api.controllers

import com.devicetracker.api.models.DashboardDTO
import com.devicetracker.api.services.AlertService
import com.devicetracker.api.services.AuditService
import com.devicetracker.api.services.DeviceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val deviceService: DeviceService,
    private val alertService: AlertService,
    private val auditService: AuditService
) {
    
    @GetMapping("/stats")
    fun getDashboardStats(): ResponseEntity<DashboardDTO> {
        val allDevices = deviceService.getAllDevices()
        val allAlerts = alertService.getAllAlerts()
        val allAuditLogs = auditService.getAllAuditLogs()
        
        val totalDevices = allDevices.size
        val offlineDevices = allDevices.count { it.status.name.equals("OFFLINE", ignoreCase = true) }
        val activeAlerts = allAlerts.size
        
        val today = LocalDate.now()
        val todayStart = LocalDateTime.of(today, LocalTime.MIN)
        val todayEnd = LocalDateTime.of(today, LocalTime.MAX)
        val todayAuditLogs = allAuditLogs.count { it.createdAt.isAfter(todayStart) && it.createdAt.isBefore(todayEnd) }
        
        // Get 5 most recent alerts
        val recentAlerts = allAlerts.sortedByDescending { it.createdAt }.take(5)
        
        val dashboardStats = DashboardDTO(
            totalDevices = totalDevices,
            offlineDevices = offlineDevices,
            activeAlerts = activeAlerts,
            todayAuditLogs = todayAuditLogs,
            recentAlerts = recentAlerts
        )
        
        return ResponseEntity.ok(dashboardStats)
    }
}