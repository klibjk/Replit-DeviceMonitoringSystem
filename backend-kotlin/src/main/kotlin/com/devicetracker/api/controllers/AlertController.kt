package com.devicetracker.api.controllers

import com.devicetracker.api.models.Alert
import com.devicetracker.api.models.AlertDTO
import com.devicetracker.api.services.AlertService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/alerts")
class AlertController(private val alertService: AlertService) {
    
    @GetMapping
    fun getAllAlerts(): ResponseEntity<List<Alert>> {
        return ResponseEntity.ok(alertService.getAllAlerts())
    }
    
    @GetMapping("/device/{deviceId}")
    fun getAlertsByDeviceId(@PathVariable deviceId: Int): ResponseEntity<List<Alert>> {
        return ResponseEntity.ok(alertService.getAlertsByDeviceId(deviceId))
    }
    
    @GetMapping("/{id}")
    fun getAlertById(@PathVariable id: Int): ResponseEntity<Alert> {
        val alert = alertService.getAlertById(id)
        return if (alert.isPresent) {
            ResponseEntity.ok(alert.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PostMapping
    fun createAlert(@RequestBody alertDTO: AlertDTO): ResponseEntity<Alert> {
        val alert = alertService.createAlert(alertDTO)
        return if (alert.isPresent) {
            ResponseEntity.status(HttpStatus.CREATED).body(alert.get())
        } else {
            ResponseEntity.badRequest().build()  // Device not found
        }
    }
    
    @PutMapping("/{id}")
    fun updateAlert(@PathVariable id: Int, @RequestBody alertDTO: AlertDTO): ResponseEntity<Alert> {
        val updatedAlert = alertService.updateAlert(id, alertDTO)
        return if (updatedAlert.isPresent) {
            ResponseEntity.ok(updatedAlert.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @DeleteMapping("/{id}")
    fun deleteAlert(@PathVariable id: Int): ResponseEntity<Void> {
        val deleted = alertService.deleteAlert(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}