package com.app4080.eldercareserver.dto.user;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String primaryLocation;
    private String secondaryLocation;
    private String phoneNumber;
    private String role;
    private String privileges;
    private LocalDateTime createdAt;

    public UserResponse(Long id, String username, String email, String primaryLocation, String secondaryLocation, String phoneNumber, String role, String privileges, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.primaryLocation = primaryLocation;
        this.secondaryLocation = secondaryLocation;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.privileges = privileges;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
