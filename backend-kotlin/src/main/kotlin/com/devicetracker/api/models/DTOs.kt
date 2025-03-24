package com.devicetracker.api.models

import java.time.LocalDateTime

// User DTO
data class UserDTO(
    val username: String,
    val password: String,
    val name: String,
    val email: String
)

// Device DTO
data class DeviceDTO(
    val name: String,
    val os: String,
    val status: String,
    val location: String
)

// Alert DTO
data class AlertDTO(
    val deviceId: Int,
    val type: String,
    val message: String
)

// Dashboard DTO for statistics
data class DashboardDTO(
    val totalDevices: Int,
    val offlineDevices: Int,
    val activeAlerts: Int,
    val todayAuditLogs: Int,
    val recentAlerts: List<Alert>
)

// Extension functions for converting between DTOs and entities
fun UserDTO.toEntity(): User {
    return User(
        id = 0, // Will be assigned by the database
        username = this.username,
        password = this.password,
        name = this.name,
        email = this.email,
        createdAt = LocalDateTime.now()
    )
}

fun DeviceDTO.toEntity(): Device {
    return Device(
        id = 0, // Will be assigned by the database
        name = this.name,
        os = this.os,
        status = DeviceStatus.valueOf(this.status.uppercase()),
        location = this.location,
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )
}

fun AlertDTO.toEntity(): Alert {
    return Alert(
        id = 0, // Will be assigned by the database
        deviceId = this.deviceId,
        type = AlertType.valueOf(this.type.uppercase()),
        message = this.message,
        createdAt = LocalDateTime.now()
    )
}