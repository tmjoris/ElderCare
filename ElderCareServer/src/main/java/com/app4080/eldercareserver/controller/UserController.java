package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.user.UserRegistrationRequest;
import com.app4080.eldercareserver.dto.user.UserResponse;
import com.app4080.eldercareserver.dto.user.UserUpdateRequest;
import com.app4080.eldercareserver.dto.user.LoginRequest;
import com.app4080.eldercareserver.service.Impl.UserService;
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

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRegistrationRequest registrationRequest) {
        UserResponse userResponse = userService.registerUser(registrationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) {
        UserResponse userResponse = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(userResponse);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody LoginRequest loginRequest) {
        try {
            userService.deleteUser(loginRequest);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("User deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> userLogin(@RequestBody LoginRequest loginRequest) {
        try {
            userService.login(loginRequest);
            return ResponseEntity.ok("Login successful");
        } catch (IllegalArgumentException | AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return userService.findUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        List<UserResponse> users = userService.findUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/privileges/{privileges}")
    public ResponseEntity<List<UserResponse>> getUsersByPrivileges(@PathVariable String privileges) {
        List<UserResponse> users = userService.findUsersByPrivileges(privileges);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<UserResponse>> getUsersByEmail(@PathVariable String email) {
        List<UserResponse> users = userService.findUsersByEmail(email);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/primaryLocation/{primaryLocation}")
    public ResponseEntity<List<UserResponse>> getUsersByPrimaryLocation(@PathVariable String primaryLocation) {
        List<UserResponse> users = userService.findUsersByPrimaryLocation(primaryLocation);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/secondaryLocation/{secondaryLocation}")
    public ResponseEntity<List<UserResponse>> getUsersBySecondaryLocation(@PathVariable String secondaryLocation) {
        List<UserResponse> users = userService.findUsersBySecondaryLocation(secondaryLocation);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/role/{role}/privileges/{privileges}")
    public ResponseEntity<List<UserResponse>> getUsersByRoleAndPrivileges(
            @PathVariable String role, @PathVariable String privileges) {
        List<UserResponse> users = userService.findUsersByRoleAndPrivileges(role, privileges);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<UserResponse>> searchUsers(@PathVariable String searchTerm) {
        List<UserResponse> users = userService.searchUsers(searchTerm);
        return ResponseEntity.ok(users);
    }
}
