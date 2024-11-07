package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.user.UserRegistrationRequest;
import com.app4080.eldercareserver.dto.user.UserResponse;
import com.app4080.eldercareserver.dto.user.UserUpdateRequest;
import com.app4080.eldercareserver.dto.user.LoginRequest;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.UserRepository;
import com.app4080.eldercareserver.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegistrationRequest registrationRequest) {
        UserResponse userResponse = userService.registerUser(registrationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) {
        UserResponse userResponse = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/{id}/validate")
    public ResponseEntity<String> validateUserAccess(@PathVariable Long id, @RequestParam String required_access) {
        try {
            User user = userRepository.getReferenceById(id);
            userService.validatePrivileges(user.getUsername(), required_access);
            return ResponseEntity.ok("Access granted");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody LoginRequest loginRequest) {
        try {
            userService.deleteUser(loginRequest);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("User deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        try {
            userService.login(loginRequest);
            return ResponseEntity.ok("Login successful");
        } catch (IllegalArgumentException | AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> findByUsername(@PathVariable String username) {
        return userService.findUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> findByRole(@PathVariable String role) {
        List<UserResponse> users = userService.findUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/privileges/{privileges}")
    public ResponseEntity<List<UserResponse>> findByPrivileges(@PathVariable String privileges) {
        List<UserResponse> users = userService.findUsersByPrivileges(privileges);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<UserResponse>> findByEmail(@PathVariable String email) {
        List<UserResponse> users = userService.findUsersByEmail(email);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/primary-location/{primaryLocation}")
    public ResponseEntity<List<UserResponse>> findByPrimaryLocation(@PathVariable String primaryLocation) {
        List<UserResponse> users = userService.findUsersByPrimaryLocation(primaryLocation);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/secondary-location/{secondaryLocation}")
    public ResponseEntity<List<UserResponse>> findBySecondaryLocation(@PathVariable String secondaryLocation) {
        List<UserResponse> users = userService.findUsersBySecondaryLocation(secondaryLocation);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/role/{role}/privileges/{privileges}")
    public ResponseEntity<List<UserResponse>> findByRoleAndPrivileges(
            @PathVariable String role, @PathVariable String privileges) {
        List<UserResponse> users = userService.findUsersByRoleAndPrivileges(role, privileges);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<UserResponse>> search(@PathVariable String searchTerm) {
        List<UserResponse> users = userService.searchUsers(searchTerm);
        return ResponseEntity.ok(users);
    }
}
