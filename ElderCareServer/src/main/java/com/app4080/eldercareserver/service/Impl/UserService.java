package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.config.accessConfig;
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

    private void validatePrivileges(User currentUser, String requiredPrivilege) throws AccessDeniedException {
        Integer currentAccess = accessConfig.getTier(currentUser.getPrivileges());
        int requiredAccess = accessConfig.getTier(requiredPrivilege);

        if (currentAccess.equals(5)) {
            // Overseer has full access
            return;
        }

        if (currentAccess < requiredAccess) {
            throw new AccessDeniedException("Insufficient privileges");
        }
    }

    @Transactional
    public User createUser(User user) throws IllegalArgumentException {
        // Validate unique constraints
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User updateInfo(User user) throws IllegalArgumentException {
        if (!userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username does not exist");
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(User user) throws IllegalArgumentException {
        if (!userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username does not exist");
        }
        userRepository.delete(user);
    }

    // 0 for success, -1 for failure
    public int login(@org.jetbrains.annotations.NotNull User user) throws AccessDeniedException {
        Optional<User> existing = userRepository.findByUsername(user.getUsername());

        if (existing.isEmpty()) {
            throw new AccessDeniedException("Username not found");
        }

        if (user.getPassword().equals(existing.get().getPassword())) {
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
