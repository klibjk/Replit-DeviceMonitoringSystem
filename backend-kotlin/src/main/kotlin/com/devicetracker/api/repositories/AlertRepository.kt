package com.devicetracker.api.repositories

import com.devicetracker.api.models.Alert
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.List

@Repository
interface AlertRepository : JpaRepository<Alert, Int> {
    fun findByDeviceId(deviceId: Int): List<Alert>
}