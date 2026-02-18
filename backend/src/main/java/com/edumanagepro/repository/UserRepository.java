package com.edumanagepro.repository;

import com.edumanagepro.entity.User;
import com.edumanagepro.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByInstituteIdAndRole(UUID instituteId, UserRole role);
}
