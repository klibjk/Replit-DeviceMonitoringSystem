package com.devicetracker.api.models

import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    
    @Column(nullable = false, unique = true)
    val username: String,
    
    @Column(nullable = false)
    val password: String
) : Serializable

data class UserDTO(
    val username: String,
    val password: String
)

fun UserDTO.toEntity() = User(
    username = username,
    password = password
)