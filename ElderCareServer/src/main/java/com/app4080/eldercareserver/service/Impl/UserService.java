package com.app4080.eldercareserver.service.Impl;
import com.app4080.eldercareserver.config.accessConfig;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
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

        if(currentAccess.equals(5)){
            //overseer has full access
            return;
        }

        if (currentAccess < requiredAccess) {
            throw new AccessDeniedException("Insufficient privileges");
        }
    }

    @Transactional
    public User createUser(User user) throws AccessDeniedException {

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
    public void deleteUser(User user) throws AccessDeniedException {}

    // 0 for success, -1 for failure
    public int login(@org.jetbrains.annotations.NotNull User user) throws AccessDeniedException {
        Optional<User> existing = userRepository.findByUsername(user.getUsername());

        if (existing.isEmpty()) { throw new AccessDeniedException("Username not found"); }

        if (user.getPassword().equals(existing.get().getPassword())) {
            return 0;
        } else {
            throw new AccessDeniedException("Invalid password");
        }
    }
}
