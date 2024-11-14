package com.app4080.eldercareserver.repository;

import com.app4080.eldercareserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    List<User> findByPrivileges(String privileges);
    List<User> findByEmail(String email);
    List<User> findByPrimaryLocation(String primaryLocation);
    List<User> findBySecondaryLocation(String secondaryLocation);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    List<User> findByRoleAndPrivileges(String role, String privileges);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "u.phoneNumber LIKE CONCAT('%', :searchTerm, '%')")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);

    Optional<User> findByFirstNameAndSecondName(String firstName, String secondName);
}
