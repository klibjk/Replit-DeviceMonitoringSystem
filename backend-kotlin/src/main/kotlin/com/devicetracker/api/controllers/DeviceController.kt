package com.devicetracker.api.controllers

import com.devicetracker.api.models.Device
import com.devicetracker.api.models.DeviceDTO
import com.devicetracker.api.services.DeviceService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/devices")
class DeviceController(private val deviceService: DeviceService) {
    
    @GetMapping
    fun getAllDevices(): ResponseEntity<List<Device>> {
        return ResponseEntity.ok(deviceService.getAllDevices())
    }
    
    @GetMapping("/{id}")
    fun getDeviceById(@PathVariable id: Int): ResponseEntity<Device> {
        val device = deviceService.getDeviceById(id)
        return if (device.isPresent) {
            ResponseEntity.ok(device.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PostMapping
    fun createDevice(@RequestBody deviceDTO: DeviceDTO): ResponseEntity<Device> {
        val device = deviceService.createDevice(deviceDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(device)
    }
    
    @PutMapping("/{id}")
    fun updateDevice(@PathVariable id: Int, @RequestBody deviceDTO: DeviceDTO): ResponseEntity<Device> {
        val updatedDevice = deviceService.updateDevice(id, deviceDTO)
        return if (updatedDevice.isPresent) {
            ResponseEntity.ok(updatedDevice.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @DeleteMapping("/{id}")
    fun deleteDevice(@PathVariable id: Int): ResponseEntity<Void> {
        val deleted = deviceService.deleteDevice(id)
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}