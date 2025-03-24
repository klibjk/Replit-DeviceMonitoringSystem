package com.devicetracker.api.services

import com.devicetracker.api.models.Device
import com.devicetracker.api.models.DeviceDTO
import com.devicetracker.api.models.DeviceStatus
import com.devicetracker.api.models.toEntity
import com.devicetracker.api.repositories.DeviceRepository
import com.devicetracker.api.services.AuditService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.Optional

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,
    private val auditService: AuditService
) {
    
    fun getAllDevices(): List<Device> {
        return deviceRepository.findAll()
    }
    
    fun getDeviceById(id: Int): Optional<Device> {
        return deviceRepository.findById(id)
    }
    
    @Transactional
    fun createDevice(deviceDTO: DeviceDTO): Device {
        val device = deviceRepository.save(deviceDTO.toEntity())
        auditService.createAuditLog("devices", "CREATE", device.id)
        return device
    }
    
    @Transactional
    fun updateDevice(id: Int, deviceDTO: DeviceDTO): Optional<Device> {
        val optionalDevice = deviceRepository.findById(id)
        
        if (optionalDevice.isPresent) {
            val existingDevice = optionalDevice.get()
            val updatedDevice = Device(
                id = existingDevice.id,
                name = deviceDTO.name,
                os = deviceDTO.os,
                status = DeviceStatus.valueOf(deviceDTO.status.uppercase()),
                location = deviceDTO.location,
                createdAt = existingDevice.createdAt,
                updatedAt = LocalDateTime.now()
            )
            
            val savedDevice = deviceRepository.save(updatedDevice)
            auditService.createAuditLog("devices", "UPDATE", id)
            return Optional.of(savedDevice)
        }
        
        return Optional.empty()
    }
    
    @Transactional
    fun deleteDevice(id: Int): Boolean {
        val exists = deviceRepository.existsById(id)
        
        if (exists) {
            deviceRepository.deleteById(id)
            auditService.createAuditLog("devices", "DELETE", id)
            return true
        }
        
        return false
    }
}