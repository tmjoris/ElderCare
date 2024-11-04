package com.app4080.eldercareserver.dto.user;

public class UserRegistrationRequest {
    private String username;
    private String password;
    private String email;
    private String primaryLocation;
    private String role;
    private String privileges;

    // Optional fields
    private String secondaryLocation;
    private String phoneNumber;

    public UserRegistrationRequest(String username, String password, String email, String primaryLocation, String role, String privileges, String secondaryLocation, String phoneNumber) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.primaryLocation = primaryLocation;
        this.role = role;
        this.privileges = privileges;
        this.secondaryLocation = secondaryLocation;
        this.phoneNumber = phoneNumber;
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

    public String getPrimaryLocation() {
        return primaryLocation;
    }

    public void setPrimaryLocation(String primaryLocation) {
        this.primaryLocation = primaryLocation;
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
}
