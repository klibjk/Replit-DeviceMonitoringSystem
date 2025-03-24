package com.devicetracker.api.tests

import com.devicetracker.api.models.Device
import com.devicetracker.api.models.DeviceDTO
import com.devicetracker.api.models.DeviceStatus
import com.devicetracker.api.repositories.DeviceRepository
import com.devicetracker.api.services.AuditService
import com.devicetracker.api.services.DeviceService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import java.time.LocalDateTime
import java.util.Optional
import org.junit.jupiter.api.Assertions.*

@ExtendWith(MockitoExtension::class)
class DeviceServiceTest {

    @Mock
    private lateinit var deviceRepository: DeviceRepository
    
    @Mock
    private lateinit var auditService: AuditService
    
    @InjectMocks
    private lateinit var deviceService: DeviceService
    
    private lateinit var testDevice: Device
    private lateinit var testDeviceDTO: DeviceDTO
    
    @BeforeEach
    fun setUp() {
        // Initialize test data
        testDevice = Device(
            id = 1,
            name = "Test Device",
            os = "Windows 11",
            status = DeviceStatus.ONLINE,
            location = "Office",
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        
        testDeviceDTO = DeviceDTO(
            name = "Test Device",
            os = "Windows 11",
            status = "online",
            location = "Office"
        )
    }
    
    @Test
    fun `getAllDevices should return all devices`() {
        // Given
        whenever(deviceRepository.findAll()).thenReturn(listOf(testDevice))
        
        // When
        val result = deviceService.getAllDevices()
        
        // Then
        assertEquals(1, result.size)
        assertEquals(testDevice, result[0])
        verify(deviceRepository, times(1)).findAll()
    }
    
    @Test
    fun `getDeviceById should return device when exists`() {
        // Given
        whenever(deviceRepository.findById(1)).thenReturn(Optional.of(testDevice))
        
        // When
        val result = deviceService.getDeviceById(1)
        
        // Then
        assertTrue(result.isPresent)
        assertEquals(testDevice, result.get())
        verify(deviceRepository, times(1)).findById(1)
    }
    
    @Test
    fun `getDeviceById should return empty when not exists`() {
        // Given
        whenever(deviceRepository.findById(99)).thenReturn(Optional.empty())
        
        // When
        val result = deviceService.getDeviceById(99)
        
        // Then
        assertTrue(result.isEmpty)
        verify(deviceRepository, times(1)).findById(99)
    }
    
    @Test
    fun `createDevice should save and return a new device`() {
        // Given
        val deviceCaptor = argumentCaptor<Device>()
        whenever(deviceRepository.save(deviceCaptor.capture())).thenReturn(testDevice)
        doNothing().whenever(auditService).createAuditLog(any(), any(), any())
        
        // When
        val result = deviceService.createDevice(testDeviceDTO)
        
        // Then
        assertEquals(testDevice, result)
        
        // Verify the captured device has correct properties
        val capturedDevice = deviceCaptor.firstValue
        assertEquals("Test Device", capturedDevice.name)
        assertEquals("Windows 11", capturedDevice.os)
        assertEquals(DeviceStatus.ONLINE, capturedDevice.status)
        assertEquals("Office", capturedDevice.location)
        
        // Verify audit log was created
        verify(auditService, times(1)).createAuditLog(any(), any(), any())
    }
    
    @Test
    fun `updateDevice should update and return existing device`() {
        // Given
        val updatedDevice = Device(
            id = 1,
            name = "Updated Device",
            os = "Ubuntu 22.04",
            status = DeviceStatus.WARNING,
            location = "Data Center",
            createdAt = testDevice.createdAt,
            updatedAt = LocalDateTime.now()
        )
        
        val updateDTO = DeviceDTO(
            name = "Updated Device",
            os = "Ubuntu 22.04",
            status = "warning",
            location = "Data Center"
        )
        
        whenever(deviceRepository.findById(1)).thenReturn(Optional.of(testDevice))
        whenever(deviceRepository.save(any())).thenReturn(updatedDevice)
        doNothing().whenever(auditService).createAuditLog(any(), any(), any())
        
        // When
        val result = deviceService.updateDevice(1, updateDTO)
        
        // Then
        assertTrue(result.isPresent)
        assertEquals(updatedDevice, result.get())
        
        // Verify audit log was created
        verify(auditService, times(1)).createAuditLog(any(), any(), any())
    }
    
    @Test
    fun `updateDevice should return empty when device not found`() {
        // Given
        whenever(deviceRepository.findById(99)).thenReturn(Optional.empty())
        
        // When
        val result = deviceService.updateDevice(99, testDeviceDTO)
        
        // Then
        assertTrue(result.isEmpty)
        verify(deviceRepository, times(1)).findById(99)
        verify(deviceRepository, never()).save(any())
        verify(auditService, never()).createAuditLog(any(), any(), any())
    }
    
    @Test
    fun `deleteDevice should return true when successfully deleted`() {
        // Given
        whenever(deviceRepository.findById(1)).thenReturn(Optional.of(testDevice))
        doNothing().whenever(deviceRepository).deleteById(1)
        doNothing().whenever(auditService).createAuditLog(any(), any(), any())
        
        // When
        val result = deviceService.deleteDevice(1)
        
        // Then
        assertTrue(result)
        verify(deviceRepository, times(1)).findById(1)
        verify(deviceRepository, times(1)).deleteById(1)
        verify(auditService, times(1)).createAuditLog(any(), any(), any())
    }
    
    @Test
    fun `deleteDevice should return false when device not found`() {
        // Given
        whenever(deviceRepository.findById(99)).thenReturn(Optional.empty())
        
        // When
        val result = deviceService.deleteDevice(99)
        
        // Then
        assertFalse(result)
        verify(deviceRepository, times(1)).findById(99)
        verify(deviceRepository, never()).deleteById(any())
        verify(auditService, never()).createAuditLog(any(), any(), any())
    }
}