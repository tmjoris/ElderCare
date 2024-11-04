package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.config.accessConfig;
import com.app4080.eldercareserver.dto.user.UserRegistrationRequest;
import com.app4080.eldercareserver.dto.user.UserResponse;
import com.app4080.eldercareserver.dto.user.UserUpdateRequest;
import com.app4080.eldercareserver.dto.user.loginRequest;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private boolean validatePrivileges(User currentUser, String requiredPrivilege) throws AccessDeniedException {
        Integer currentAccess = accessConfig.getTier(currentUser.getPrivileges());
        int requiredAccess = accessConfig.getTier(requiredPrivilege);

        if (currentAccess.equals(5)) {
            // Overseer has full access
            return true;
        }

        if (currentAccess < requiredAccess) {
            throw new AccessDeniedException("Insufficient privileges");
        } else {
            return true;
        }
    }

    private boolean validateRole(User currentUser, List<String> requiredRole){
        return requiredRole.contains(currentUser.getRole());
    }

    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPrimaryLocation(user.getPrimaryLocation());
        response.setSecondaryLocation(user.getSecondaryLocation());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setPrivileges(user.getPrivileges());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    @Transactional
    public UserResponse registerUser(UserRegistrationRequest registrationRequest) throws IllegalArgumentException {
        // Validate unique constraints
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(registrationRequest.getUsername());
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

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id).orElseThrow(()
                -> new IllegalArgumentException("User not found"));
        user.setEmail(updateRequest.getEmail());
        user.setPrimaryLocation(updateRequest.getPrimaryLocation());
        user.setSecondaryLocation(updateRequest.getSecondaryLocation());
        user.setPhoneNumber(updateRequest.getPhoneNumber());
        user.setRole(updateRequest.getRole());
        user.setPrivileges(updateRequest.getPrivileges());

        user = userRepository.save(user);
        return convertToResponse(user);
    }

    @Transactional
    public void deleteUser(loginRequest lr) throws IllegalArgumentException {
        Optional<User> user = userRepository.findByUsername(lr.getUsername());

        if (user.isEmpty()) {throw new IllegalArgumentException("User not found");}

        userRepository.delete(user.get());
    }

    // 0 for success, -1 for failure
    public int login(loginRequest loginRequest) throws AccessDeniedException, IllegalArgumentException {
        Optional<User> existing = userRepository.findByUsername(loginRequest.getUsername());

        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Username not found");
        }

        if (loginRequest.getPassword().equals(existing.get().getPassword())) {
            return 0;
        } else {
            throw new AccessDeniedException("Invalid password");
        }
    }

    // Find a user by username
    @Transactional(readOnly = true)
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Find users by role
    @Transactional(readOnly = true)
    public List<User> findUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    // Find users by privileges
    @Transactional(readOnly = true)
    public List<User> findUsersByPrivileges(String privileges) {
        return userRepository.findByPrivileges(privileges);
    }

    // Find users by email
    @Transactional(readOnly = true)
    public List<User> findUsersByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Find users by primary location
    @Transactional(readOnly = true)
    public List<User> findUsersByPrimaryLocation(String primaryLocation) {
        return userRepository.findByPrimaryLocation(primaryLocation);
    }

    // Find users by secondary location
    @Transactional(readOnly = true)
    public List<User> findUsersBySecondaryLocation(String secondaryLocation) {
        return userRepository.findBySecondaryLocation(secondaryLocation);
    }

    // Find users by role and privileges
    @Transactional(readOnly = true)
    public List<User> findUsersByRoleAndPrivileges(String role, String privileges) {
        return userRepository.findByRoleAndPrivileges(role, privileges);
    }

    // Search for users by term in username, email, or phone number
    @Transactional(readOnly = true)
    public List<User> searchUsers(String searchTerm) {
        return userRepository.searchUsers(searchTerm);
    }
}
