package com.app4080.eldercareserver.dto.user;

public class UserUpdateRequest {
    private String email;
    private String primaryLocation;
    private String secondaryLocation;
    private String phoneNumber;
    private String role;
    private String privileges;

    public UserUpdateRequest(String email, String primaryLocation, String secondaryLocation, String phoneNumber, String role, String privileges) {
        this.email = email;
        this.primaryLocation = primaryLocation;
        this.secondaryLocation = secondaryLocation;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.privileges = privileges;
    }

    // Getters and setters

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
}
