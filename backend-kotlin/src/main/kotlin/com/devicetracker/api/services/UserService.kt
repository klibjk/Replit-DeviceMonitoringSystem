package com.devicetracker.api.services

import com.devicetracker.api.models.User
import com.devicetracker.api.models.UserDTO
import com.devicetracker.api.models.toEntity
import com.devicetracker.api.repositories.UserRepository
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class UserService(private val userRepository: UserRepository) {
    
    fun findById(id: Int): Optional<User> {
        return userRepository.findById(id)
    }
    
    fun findByUsername(username: String): Optional<User> {
        return userRepository.findByUsername(username)
    }
    
    fun createUser(userDTO: UserDTO): User {
        return userRepository.save(userDTO.toEntity())
    }
}