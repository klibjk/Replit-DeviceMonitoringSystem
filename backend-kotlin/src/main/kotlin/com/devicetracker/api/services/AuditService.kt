package com.devicetracker.api.services

import com.devicetracker.api.models.AuditAction
import com.devicetracker.api.models.AuditLog
import com.devicetracker.api.repositories.AuditLogRepository
import org.springframework.stereotype.Service

@Service
class AuditService(private val auditLogRepository: AuditLogRepository) {
    
    fun getAllAuditLogs(): List<AuditLog> {
        return auditLogRepository.findAll()
    }
    
    fun createAuditLog(tableName: String, action: String, recordId: Int, performedBy: String = "system"): AuditLog {
        val auditLog = AuditLog(
            tableName = tableName,
            action = AuditAction.valueOf(action.uppercase()),
            recordId = recordId,
            performedBy = performedBy
        )
        
        return auditLogRepository.save(auditLog)
    }
}