package com.devicetracker.api.tests

import com.devicetracker.api.models.Device
import com.devicetracker.api.models.DeviceStatus
import com.devicetracker.api.repositories.DeviceRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.time.LocalDateTime

@DataJpaTest
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class DeviceRepositoryTest {
    
    companion object {
        @Container
        val postgresContainer = PostgreSQLContainer<Nothing>("postgres:15-alpine").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }
        
        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgresContainer::getJdbcUrl)
            registry.add("spring.datasource.username", postgresContainer::getUsername)
            registry.add("spring.datasource.password", postgresContainer::getPassword)
        }
    }
    
    @Autowired
    private lateinit var deviceRepository: DeviceRepository
    
    private lateinit var device1: Device
    private lateinit var device2: Device
    
    @BeforeEach
    fun setUp() {
        // Create test devices
        device1 = Device(
            name = "Test Device 1",
            os = "Windows 11",
            status = DeviceStatus.ONLINE,
            location = "Office"
        )
        
        device2 = Device(
            name = "Test Device 2",
            os = "Ubuntu 22.04",
            status = DeviceStatus.OFFLINE,
            location = "Data Center"
        )
        
        // Save test devices
        deviceRepository.saveAll(listOf(device1, device2))
    }
    
    @AfterEach
    fun tearDown() {
        deviceRepository.deleteAll()
    }
    
    @Test
    fun `should find all devices`() {
        // When
        val devices = deviceRepository.findAll()
        
        // Then
        assertEquals(2, devices.size)
        assertTrue(devices.any { it.name == "Test Device 1" })
        assertTrue(devices.any { it.name == "Test Device 2" })
    }
    
    @Test
    fun `should find device by id`() {
        // Find saved device ID
        val savedDevice = deviceRepository.findAll()
            .first { it.name == "Test Device 1" }
        
        // When
        val foundDevice = deviceRepository.findById(savedDevice.id)
        
        // Then
        assertTrue(foundDevice.isPresent)
        assertEquals("Test Device 1", foundDevice.get().name)
        assertEquals("Windows 11", foundDevice.get().os)
        assertEquals(DeviceStatus.ONLINE, foundDevice.get().status)
        assertEquals("Office", foundDevice.get().location)
    }
    
    @Test
    fun `should save new device`() {
        // Given
        val newDevice = Device(
            name = "New Device",
            os = "MacOS",
            status = DeviceStatus.WARNING,
            location = "Home Office"
        )
        
        // When
        val savedDevice = deviceRepository.save(newDevice)
        
        // Then
        assertNotNull(savedDevice.id)
        assertEquals("New Device", savedDevice.name)
        assertEquals("MacOS", savedDevice.os)
        assertEquals(DeviceStatus.WARNING, savedDevice.status)
        assertEquals("Home Office", savedDevice.location)
    }
    
    @Test
    fun `should update existing device`() {
        // Find saved device to update
        val deviceToUpdate = deviceRepository.findAll()
            .first { it.name == "Test Device 2" }
        
        // Create updated device
        val updatedDevice = Device(
            id = deviceToUpdate.id,
            name = "Updated Device 2",
            os = deviceToUpdate.os,
            status = DeviceStatus.ERROR,
            location = "New Location",
            createdAt = deviceToUpdate.createdAt,
            updatedAt = LocalDateTime.now()
        )
        
        // When
        val result = deviceRepository.save(updatedDevice)
        
        // Then
        assertEquals(deviceToUpdate.id, result.id)
        assertEquals("Updated Device 2", result.name)
        assertEquals("Ubuntu 22.04", result.os)
        assertEquals(DeviceStatus.ERROR, result.status)
        assertEquals("New Location", result.location)
    }
    
    @Test
    fun `should delete device`() {
        // Find saved device to delete
        val deviceToDelete = deviceRepository.findAll()
            .first { it.name == "Test Device 1" }
        
        // When
        deviceRepository.deleteById(deviceToDelete.id)
        
        // Then
        val deletedDevice = deviceRepository.findById(deviceToDelete.id)
        assertTrue(deletedDevice.isEmpty)
    }
}