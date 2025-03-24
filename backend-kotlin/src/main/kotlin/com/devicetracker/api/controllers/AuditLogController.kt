package com.devicetracker.api.controllers

import com.devicetracker.api.models.AuditLog
import com.devicetracker.api.services.AuditService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/audit-logs")
class AuditLogController(private val auditService: AuditService) {
    
    @GetMapping
    fun getAllAuditLogs(): ResponseEntity<List<AuditLog>> {
        return ResponseEntity.ok(auditService.getAllAuditLogs())
    }
}