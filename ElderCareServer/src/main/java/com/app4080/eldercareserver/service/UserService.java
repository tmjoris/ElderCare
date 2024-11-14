package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.config.accessConfig;
import com.app4080.eldercareserver.dto.user.UserRegistrationRequest;
import com.app4080.eldercareserver.dto.user.UserResponse;
import com.app4080.eldercareserver.dto.user.UserUpdateRequest;
import com.app4080.eldercareserver.dto.user.LoginRequest;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Validate user privileges
    public void validatePrivileges(String username, String requiredPrivilege) throws AccessDeniedException {
        User user = fetchUserByUsername(username);
        int currentAccess = accessConfig.getTier(user.getPrivileges());
        int requiredAccess = accessConfig.getTier(requiredPrivilege);

        if (currentAccess < requiredAccess) {
            throw new AccessDeniedException("Insufficient privileges for this operation");
        }
    }

    // Validate user role
    public void validateRole(String username, List<String> requiredRole) throws AccessDeniedException {
        User user = fetchUserByUsername(username);
        if (requiredRole.contains(user.getRole())) return;

        throw new AccessDeniedException("User lacking required role");
    }

    // Convert User entity to UserResponse DTO
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setSecondName(user.getSecondName());
        response.setEmail(user.getEmail());
        response.setPrimaryLocation(user.getPrimaryLocation());
        response.setSecondaryLocation(user.getSecondaryLocation());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setPrivileges(user.getPrivileges());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    // Register a new user
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest registrationRequest) throws IllegalArgumentException {
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setFirstName(registrationRequest.getFirstName());
        user.setSecondName(registrationRequest.getSecondName());
        user.setPassword(registrationRequest.getPassword()); // Remember to hash the password!
        user.setEmail(registrationRequest.getEmail());
        user.setPrimaryLocation(registrationRequest.getPrimaryLocation());
        user.setSecondaryLocation(registrationRequest.getSecondaryLocation());
        user.setPhoneNumber(registrationRequest.getPhoneNumber());
        user.setRole(registrationRequest.getRole());
        user.setPrivileges(registrationRequest.getPrivileges());
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return convertToResponse(user);
    }

    // Update an existing user
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("User not found"));

        user.setEmail(updateRequest.getEmail());
        user.setPrimaryLocation(updateRequest.getPrimaryLocation());
        user.setSecondaryLocation(updateRequest.getSecondaryLocation());
        user.setPhoneNumber(updateRequest.getPhoneNumber());
        user.setRole(updateRequest.getRole());
        user.setPrivileges(updateRequest.getPrivileges());

        user = userRepository.save(user);
        return convertToResponse(user);
    }

    // Delete a user based on login request
    @Transactional
    public void deleteUser(LoginRequest lr) throws IllegalArgumentException {
        Optional<User> user = userRepository.findByUsername(lr.getUsername());

        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        userRepository.delete(user.get());
    }

    // Login validation
    public void login(LoginRequest loginRequest) throws AccessDeniedException, IllegalArgumentException {
        Optional<User> existing = userRepository.findByUsername(loginRequest.getUsername());

        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Username not found");
        }

        if (!loginRequest.getPassword().equals(existing.get().getPassword())) {
            throw new AccessDeniedException("Invalid password");
        }
    }

    // Fetch user by username
    public User fetchUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // Find user by first and second names
    @Transactional(readOnly = true)
    public Optional<UserResponse> findUserByFirstNameAndSecondName(String firstName, String secondName) {
        return userRepository.findByFirstNameAndSecondName(firstName, secondName)
                .map(this::convertToResponse);
    }

    // Find user by username
    @Transactional(readOnly = true)
    public Optional<UserResponse> findUserByUsername(String username) {
        return userRepository.findByUsername(username).map(this::convertToResponse);
    }

    // Find users by role
    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Find users by privileges
    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByPrivileges(String privileges) {
        return userRepository.findByPrivileges(privileges).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Find users by email
    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByEmail(String email) {
        return userRepository.findByEmail(email).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Find users by primary location
    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByPrimaryLocation(String primaryLocation) {
        return userRepository.findByPrimaryLocation(primaryLocation).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Find users by secondary location
    @Transactional(readOnly = true)
    public List<UserResponse> findUsersBySecondaryLocation(String secondaryLocation) {
        return userRepository.findBySecondaryLocation(secondaryLocation).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Find users by role and privileges
    @Transactional(readOnly = true)
    public List<UserResponse> findUsersByRoleAndPrivileges(String role, String privileges) {
        return userRepository.findByRoleAndPrivileges(role, privileges).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Search for users by term in username, email, or phone number
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String searchTerm) {
        return userRepository.searchUsers(searchTerm).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}

