package com.devicetracker.api.models

import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDateTime

enum class AlertType {
    INFO, WARNING, CRITICAL
}

@Entity
@Table(name = "alerts")
data class Alert(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    
    @Column(name = "device_id", nullable = false)
    val deviceId: Int,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val type: AlertType,
    
    @Column(nullable = false)
    val message: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
) : Serializable

data class AlertDTO(
    val deviceId: Int,
    val type: String,
    val message: String
)

fun AlertDTO.toEntity() = Alert(
    deviceId = deviceId,
    type = AlertType.valueOf(type.uppercase()),
    message = message
)