package com.devicetracker.api.models

import jakarta.persistence.*
import java.time.LocalDateTime

enum class AlertType {
    INFO,
    WARNING,
    CRITICAL
}

@Entity
@Table(name = "alerts")
data class Alert(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    
    @Column(name = "device_id", nullable = false)
    val deviceId: Int,
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val type: AlertType,
    
    @Column(nullable = false)
    val message: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)