package com.devicetracker.api.models

import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDateTime

enum class DeviceStatus {
    ONLINE, OFFLINE, WARNING, ERROR
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
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val status: DeviceStatus,
    
    @Column(nullable = false)
    val location: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
) : Serializable

data class DeviceDTO(
    val name: String,
    val os: String,
    val status: String,
    val location: String
)

fun DeviceDTO.toEntity() = Device(
    name = name,
    os = os,
    status = DeviceStatus.valueOf(status.uppercase()),
    location = location
)