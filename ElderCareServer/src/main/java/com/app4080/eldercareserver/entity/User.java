package com.app4080.eldercareserver.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, length = 100, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "primary_location", nullable = false)
    private String primaryLocation;

    @Column(name = "secondary_location", nullable = true)
    private String secondaryLocation;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "role", nullable = false, length = 50)
    private String role;

    @Column(name = "privileges", nullable = false)
    private String privileges;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public User(String username, String password, String email, String phoneNumber, String role, String privileges) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.privileges = privileges;
    }

    public User(String username, String password, String email, String primaryLocation, String secondaryLocation, String phoneNumber, String role, String privileges) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.primaryLocation = primaryLocation;
        this.secondaryLocation = secondaryLocation;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.privileges = privileges;
    }

    public User() {

    }

    public User(Long userId) {

    }

    public Long getId() {
        return id;
    }

    public String getPrimaryLocation() {
        return primaryLocation;
    }

    public void setPrimaryLocation(String primaryLocation) {
        this.primaryLocation = primaryLocation;
    }

    public String getSecondaryLocation() {
        return secondaryLocation;
    }

    public void setSecondaryLocation(String secondaryLocation) {
        this.secondaryLocation = secondaryLocation;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPrivileges() {
        return privileges;
    }

    public void setPrivileges(String privileges) {
        this.privileges = privileges;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
