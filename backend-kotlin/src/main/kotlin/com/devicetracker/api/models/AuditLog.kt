package com.devicetracker.api.models

import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDateTime

enum class AuditAction {
    CREATE, UPDATE, DELETE
}

@Entity
@Table(name = "audit_logs")
data class AuditLog(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    
    @Column(name = "table_name", nullable = false)
    val tableName: String,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val action: AuditAction,
    
    @Column(name = "record_id", nullable = false)
    val recordId: Int,
    
    @Column(name = "performed_by", nullable = false)
    val performedBy: String = "system",
    
    @Column(nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now()
) : Serializable

data class AuditLogDTO(
    val tableName: String,
    val action: String,
    val recordId: Int,
    val performedBy: String
)

fun AuditLogDTO.toEntity() = AuditLog(
    tableName = tableName,
    action = AuditAction.valueOf(action.uppercase()),
    recordId = recordId,
    performedBy = performedBy
)