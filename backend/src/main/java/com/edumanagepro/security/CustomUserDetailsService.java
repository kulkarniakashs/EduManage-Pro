package com.edumanagepro.security;

import com.edumanagepro.entity.User;
import com.edumanagepro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new UserPrincipal(
                u.getId(),
                u.getEmail(),
                u.getPasswordHash(),
                u.getFullName(),
                u.getRole(),
                u.isActive(),
                u.getProfilePhotoKey()
        );
    }
}
