package com.devicetracker.api.services

import com.devicetracker.api.models.Alert
import com.devicetracker.api.models.AlertDTO
import com.devicetracker.api.models.AlertType
import com.devicetracker.api.models.toEntity
import com.devicetracker.api.repositories.AlertRepository
import com.devicetracker.api.repositories.DeviceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

@Service
class AlertService(
    private val alertRepository: AlertRepository,
    private val deviceRepository: DeviceRepository,
    private val auditService: AuditService
) {
    
    fun getAllAlerts(): List<Alert> {
        return alertRepository.findAll()
    }
    
    fun getAlertsByDeviceId(deviceId: Int): List<Alert> {
        return alertRepository.findByDeviceId(deviceId)
    }
    
    fun getAlertById(id: Int): Optional<Alert> {
        return alertRepository.findById(id)
    }
    
    @Transactional
    fun createAlert(alertDTO: AlertDTO): Optional<Alert> {
        // Check if device exists
        val deviceExists = deviceRepository.existsById(alertDTO.deviceId)
        if (!deviceExists) {
            return Optional.empty()
        }
        
        val alert = alertRepository.save(alertDTO.toEntity())
        auditService.createAuditLog("alerts", "CREATE", alert.id)
        return Optional.of(alert)
    }
    
    @Transactional
    fun updateAlert(id: Int, alertDTO: AlertDTO): Optional<Alert> {
        val optionalAlert = alertRepository.findById(id)
        
        if (optionalAlert.isPresent) {
            // Check if device exists
            val deviceExists = deviceRepository.existsById(alertDTO.deviceId)
            if (!deviceExists) {
                return Optional.empty()
            }
            
            val existingAlert = optionalAlert.get()
            val updatedAlert = Alert(
                id = existingAlert.id,
                deviceId = alertDTO.deviceId,
                type = AlertType.valueOf(alertDTO.type.uppercase()),
                message = alertDTO.message,
                createdAt = existingAlert.createdAt
            )
            
            val savedAlert = alertRepository.save(updatedAlert)
            auditService.createAuditLog("alerts", "UPDATE", id)
            return Optional.of(savedAlert)
        }
        
        return Optional.empty()
    }
    
    @Transactional
    fun deleteAlert(id: Int): Boolean {
        val exists = alertRepository.existsById(id)
        
        if (exists) {
            alertRepository.deleteById(id)
            auditService.createAuditLog("alerts", "DELETE", id)
            return true
        }
        
        return false
    }
}