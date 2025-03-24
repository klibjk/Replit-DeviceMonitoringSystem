package com.devicetracker.api.models

import jakarta.persistence.*
import java.time.LocalDateTime

enum class DeviceStatus {
    ONLINE,
    OFFLINE,
    WARNING,
    ERROR
}

@Entity
@Table(name = "devices")
data class Device(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    
    @Column(nullable = false)
    val name: String,
    
    @Column(nullable = false)
    val os: String,
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: DeviceStatus,
    
    @Column(nullable = false)
    val location: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)