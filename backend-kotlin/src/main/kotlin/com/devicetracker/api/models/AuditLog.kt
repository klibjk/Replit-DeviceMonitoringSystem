package com.devicetracker.api.models

import jakarta.persistence.*
import java.time.LocalDateTime

enum class AuditAction {
    CREATE,
    UPDATE,
    DELETE
}

@Entity
@Table(name = "audit_logs")
data class AuditLog(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    
    @Column(name = "table_name", nullable = false)
    val tableName: String,
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val action: AuditAction,
    
    @Column(name = "record_id", nullable = false)
    val recordId: Int,
    
    @Column(name = "performed_by", nullable = false)
    val performedBy: String = "system",
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)